import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

const FeaturedCollections = ({ showViewAll = true }) => {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [addedId, setAddedId] = useState(null);

  // On the homepage we show 4 featured items; on the Collections page we show all.
  const featuredProducts = useMemo(
    () => (showViewAll ? products.slice(0, 4) : products),
    [products, showViewAll],
  );

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section id="collections" className="py-24 px-6 md:px-12 bg-paper">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.4em] text-gold font-semibold mb-4 block">Our Collections</span>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">Featured <br /> <span className="italic">Masterpieces</span></h2>
          </div>
          <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
            Each fragrance is a unique olfactory journey, meticulously crafted by our master perfumers in Grasse.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {loading && featuredProducts.length === 0 ? (
            [...Array(showViewAll ? 4 : 8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#F2F0ED] mb-6" />
                <div className="h-3 bg-gray-100 w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 w-1/2" />
              </div>
            ))
          ) : (
            featuredProducts.map((product, index) => (
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
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F2F0ED] mb-6">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[8px] uppercase tracking-widest bg-white/90 px-2 py-1 font-bold text-ink">
                      {product.gender}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors" onClick={(e) => e.preventDefault()}>
                      <Heart className="w-4 h-4 text-ink" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <button 
                      className={`w-full py-3 text-[9px] uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                        addedId === product.id ? 'bg-gold text-white' : 'bg-white/90 backdrop-blur-md text-ink hover:bg-gold hover:text-white'
                      }`}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> {addedId === product.id ? 'Added' : 'Quick Add'}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">{product.brand} • {product.collection}</p>
                      <h3 className="text-lg font-serif group-hover:text-gold transition-colors">{product.name}</h3>
                    </div>
                    <span className="text-sm font-medium text-gold">${product.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{product.description}</p>
                </div>
              </motion.div>
            </Link>
            ))
          )}
        </div>

        {showViewAll && (
          <div className="mt-20 text-center">
            <Link 
              to="/collections" 
              className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.3em] font-bold group"
            >
              View All Collections
              <div className="w-12 h-px bg-gold group-hover:w-20 transition-all duration-300" />
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollections;
