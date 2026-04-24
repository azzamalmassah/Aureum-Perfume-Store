import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createPaymentSession, purchaseItems } from '../lib/api';
import { useProducts } from '../context/ProductsContext';

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { refreshProducts } = useProducts();
  const [paymentProvider, setPaymentProvider] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const subtotal = cartSubtotal;
  const shipping = 0;
  const total = subtotal + shipping;

  const itemsForApi = useMemo(
    () =>
      cartItems.map((it) => ({
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        images: it.images,
        image: it.image,
      })),
    [cartItems],
  );

  useEffect(() => {
    // If user comes back from provider, show success UI
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
      (async () => {
        try {
          await purchaseItems(cartItems.map((it) => ({ id: it.id, quantity: it.quantity })));
          await refreshProducts();
        } catch {
          // If stock update fails, we still show success since payment completed.
        } finally {
          setIsSuccess(true);
          clearCart();
        }
      })();
    }
  }, [clearCart, cartItems, refreshProducts]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    try {
      const origin = window.location.origin;
      const session = await createPaymentSession({
        provider: paymentProvider,
        items: itemsForApi,
        successUrl: `${origin}/checkout?success=1`,
        cancelUrl: `${origin}/checkout?cancel=1`,
      });

      if (!session?.redirectUrl) {
        throw new Error('Payment provider did not return a redirect URL.');
      }

      window.location.href = session.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed.');
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen flex items-center justify-center bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-gold" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-serif italic">Thank You</h2>
            <p className="text-gray-500 leading-relaxed">
              Your order has been placed successfully. A confirmation email has been sent to your inbox.
            </p>
          </div>
          <div className="pt-8">
            <Link 
              to="/" 
              className="inline-block px-10 py-5 bg-ink text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-6 block">Secure Checkout</span>
          <h2 className="text-5xl md:text-7xl font-serif leading-tight">Finalize <span className="italic">Order</span></h2>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-7 space-y-12">
            {/* Shipping Information */}
            <section className="space-y-8">
              <h3 className="text-xl font-serif border-b border-gray-100 pb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">First Name</label>
                  <input type="text" required className="w-full border-b border-gray-200 py-3 focus:border-gold outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Last Name</label>
                  <input type="text" required className="w-full border-b border-gray-200 py-3 focus:border-gold outline-none transition-colors" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Address</label>
                  <input type="text" required className="w-full border-b border-gray-200 py-3 focus:border-gold outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">City</label>
                  <input type="text" required className="w-full border-b border-gray-200 py-3 focus:border-gold outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Postal Code</label>
                  <input type="text" required className="w-full border-b border-gray-200 py-3 focus:border-gold outline-none transition-colors" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="space-y-8">
              <h3 className="text-xl font-serif border-b border-gray-100 pb-4">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentProvider('stripe')}
                  className={`p-6 text-left transition-all duration-300 flex items-center gap-4 border ${
                    paymentProvider === 'stripe'
                      ? 'border-gold bg-gold/5'
                      : 'border-gray-200 hover:border-gold/50'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentProvider === 'stripe' ? 'text-gold' : 'text-gray-500'}`} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">Stripe</p>
                    <p className="text-[10px] text-gray-400">Pay securely with card via Stripe Checkout</p>
                  </div>
                </button>
              </div>

              {error && (
                <div className="pt-4 text-sm text-red-600">
                  {error}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#F9F8F6] p-10 space-y-10 sticky top-32">
              <h3 className="text-2xl font-serif italic">Order Summary</h3>
              
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-white overflow-hidden flex-shrink-0">
                      <img 
                        src={item.images ? item.images[0] : item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-serif">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.brand} • {item.quantity} x ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subtotal}.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gold">Complimentary</span>
                </div>
                <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Total Amount</p>
                    <p className="text-3xl font-serif text-gold">${total}.00</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="flex w-full items-center justify-center gap-3 rounded-sm border border-stone-900 bg-stone-900 px-6 py-6 text-[10px] font-bold uppercase tracking-[0.4em] text-white shadow-sm transition-all duration-500 hover:border-amber-600 hover:bg-amber-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>Pay with Stripe <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                <ShieldCheck className="w-4 h-4" />
                Secure SSL Encryption
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
