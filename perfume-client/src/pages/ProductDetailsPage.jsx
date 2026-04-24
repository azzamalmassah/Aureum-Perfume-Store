import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { byId, ensureProduct, loading } = useProducts();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existing = byId.get(String(id));
      if (existing) {
        if (!cancelled) setProduct(existing);
        return;
      }
      try {
        const fetched = await ensureProduct(id);
        if (!cancelled) setProduct(fetched);
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) window.scrollTo(0, 0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, byId, ensureProduct]);

  const handleAddToCart = () => {
    if (product && Number(product.stock || 0) > 0) {
      addToCart(product, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">{loading ? 'Loading product…' : 'Product not found'}</h2>
          <Link to="/collections" className="text-gold uppercase tracking-widest text-xs font-bold border-b border-gold pb-1">
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-12">
          <Link to="/" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link to="/collections" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">Collections</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-[10px] uppercase tracking-widest text-ink font-bold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] bg-white overflow-hidden"
          >
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-white/90 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-ink shadow-sm">
                {product.gender}
              </span>
            </div>
            <div className="absolute top-6 right-6">
              <button className="p-3 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-sm">
                <Heart className="w-5 h-5 text-ink" />
              </button>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">{product.brand}</span>
                <span className="w-8 h-px bg-gray-200"></span>
                <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">{product.collection}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif mb-4">{product.name}</h1>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-6">{product.category}</p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-400">{product.rating} ({product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'})</span>
              </div>

              <p className="text-3xl font-serif text-gold mb-8">${product.price}</p>
              
              <p className="text-gray-600 leading-relaxed mb-12 max-w-lg">
                {product.description}
              </p>

              {/* Sizes */}
              <div className="mb-12">
                <p className="text-[10px] uppercase tracking-widest font-bold text-ink mb-4">Select Size</p>
                <div className="flex gap-4">
                  {product.sizes.map((size) => (
                    <button 
                      key={size}
                      className="px-6 py-3 border border-gray-200 text-xs hover:border-gold hover:text-gold transition-all"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-200">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 text-sm font-medium border-x border-gray-200 w-16 text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={Number(product.stock || 0) <= 0}
                  className={`flex-1 py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-3 ${
                    Number(product.stock || 0) <= 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : isAdded
                        ? 'bg-gold text-white'
                        : 'bg-ink text-white hover:bg-gold'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />{' '}
                  {Number(product.stock || 0) <= 0 ? 'Out of Stock' : isAdded ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex gap-8 mb-6">
                {['description', 'notes', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] uppercase tracking-widest font-bold pb-2 border-b-2 transition-all ${
                      activeTab === tab ? 'border-gold text-gold' : 'border-transparent text-gray-400 hover:text-ink'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="text-sm text-gray-500 leading-relaxed min-h-[100px]">
                {activeTab === 'description' && (
                  <p>{product.description} Experience the ultimate luxury with {product.name}. This fragrance opens with vibrant top notes that gracefully transition into a complex heart, finally settling into a deep, long-lasting base that defines the AUREUM signature.</p>
                )}
                {activeTab === 'notes' && (
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-ink mb-4">Key Components</p>
                      <ul className="space-y-2">
                        {product.components.map((comp) => (
                          <li key={comp} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                            {comp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-ink mb-4">Fragrance Profile</p>
                      <p>A masterfully balanced composition that highlights the purity of its premium ingredients.</p>
                    </div>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <p>Complimentary express shipping on all orders. Each bottle is carefully packaged in our signature gold-embossed box and includes a sample of another fragrance from our collection.</p>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-gray-100">
              <div className="flex flex-col items-center text-center gap-3">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span className="text-[9px] uppercase tracking-widest text-gray-400">Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Truck className="w-5 h-5 text-gold" />
                <span className="text-[9px] uppercase tracking-widest text-gray-400">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <RefreshCw className="w-5 h-5 text-gold" />
                <span className="text-[9px] uppercase tracking-widest text-gray-400">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
