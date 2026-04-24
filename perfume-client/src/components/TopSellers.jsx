import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

const TopSellers = ({ showViewAll = true }) => {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [addedId, setAddedId] = useState(null);

  // Use specific products for top sellers (e.g., 5, 6, 7)
  const sellerProducts = useMemo(
    () =>
      products.slice(0, 3).map((p) => ({
        ...p,
        reviews: 124,
        badge: 'Best Seller',
      })),
    [products],
  );

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section id="popular" className="py-32 px-6 md:px-12 bg-[#F9F8F6] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-6 block">Curated Selection</span>
            <h2 className="text-5xl md:text-7xl font-serif leading-tight">The <span className="italic">Popular</span> <br /> Choice</h2>
          </div>
          {showViewAll && (
            <Link 
              to="/top-sellers"
              className="flex items-center gap-4 text-xs uppercase tracking-widest font-bold border-b border-ink pb-2 hover:text-gold hover:border-gold transition-all duration-300"
            >
              View All Best Sellers <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && sellerProducts.length === 0 ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-8">
                <div className="aspect-[4/5] bg-paper mb-8" />
                <div className="h-3 bg-gray-100 w-1/3 mb-2" />
                <div className="h-6 bg-gray-100 w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 w-1/2" />
              </div>
            ))
          ) : (
            sellerProducts.map((product, index) => (
            <Link 
              key={product.id}
              to={`/product/${product.id}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group bg-white p-8 border border-transparent hover:border-gold/20 transition-all duration-500"
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-8 bg-paper">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="text-[9px] font-bold bg-ink text-white px-3 py-1 uppercase tracking-widest">
                      {product.badge}
                    </span>
                    <span className="text-[8px] font-bold bg-white text-ink px-3 py-1 uppercase tracking-widest border border-gray-100">
                      {product.gender}
                    </span>
                  </div>
                  <button 
                    className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl ${
                      addedId === product.id ? 'bg-gold text-white opacity-100 translate-y-0' : 'bg-white hover:bg-gold hover:text-white'
                    }`}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">{product.brand}</p>
                      <h3 className="text-2xl font-serif mb-1 group-hover:text-gold transition-colors">{product.name}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">{product.category}</p>
                    </div>
                    <span className="text-lg font-medium text-gold">${product.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">({product.reviews} Reviews)</span>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  <div className="pt-4">
                    <button 
                      className={`w-full py-4 border text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${
                        addedId === product.id ? 'bg-gold text-white border-gold' : 'border-ink hover:bg-ink hover:text-white'
                      }`}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      {addedId === product.id ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
            ))
          )}
        </div>

        {/* Social Proof / Trust Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-24 pt-12 border-t border-gray-200 flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-50 grayscale"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold italic">Vogue</span>
          <span className="text-xs uppercase tracking-[0.4em] font-bold italic">Harper's Bazaar</span>
          <span className="text-xs uppercase tracking-[0.4em] font-bold italic">Elle</span>
          <span className="text-xs uppercase tracking-[0.4em] font-bold italic">GQ</span>
          <span className="text-xs uppercase tracking-[0.4em] font-bold italic">The New York Times</span>
        </motion.div>
      </div>
    </section>
  );
};

export default TopSellers;
