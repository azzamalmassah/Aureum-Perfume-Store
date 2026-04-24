import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal } = useCart();

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-6 block">Your Selection</span>
            <h2 className="text-5xl md:text-7xl font-serif leading-tight">The <span className="italic">Cart</span></h2>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-8 border-b border-gray-100 pb-8"
                >
                  <div className="w-32 h-40 bg-paper overflow-hidden">
                    <img 
                      src={item.images ? item.images[0] : item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-serif mb-1">{item.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">{item.brand} • {item.category}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-ink transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-xs font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-lg font-medium text-gold">${item.price * item.quantity}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#F9F8F6] p-8 space-y-8">
                <h3 className="text-xl font-serif">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${cartSubtotal}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold">Calculated at checkout</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-xl text-gold">${cartSubtotal}.00</span>
                  </div>
                </div>
                <Link 
                  to="/checkout"
                  className="flex w-full items-center justify-center rounded-sm border border-stone-900 bg-stone-900 px-6 py-5 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-sm transition-all duration-300 hover:border-amber-600 hover:bg-amber-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  Proceed to Checkout
                </Link>
                <Link 
                  to="/" 
                  className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-ink transition-colors"
                >
                  Continue Shopping <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 space-y-8">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-200" />
            <p className="text-gray-500 font-serif italic text-xl">Your cart is currently empty.</p>
            <Link 
              to="/" 
              className="inline-block px-10 py-5 bg-gold text-white text-[10px] uppercase tracking-widest font-bold hover:bg-ink transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
