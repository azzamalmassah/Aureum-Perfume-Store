import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { products } = useProducts();
  const { user, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu and search on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  // Handle search logic
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const filtered = products.filter((product) => {
        const searchableFields = [
          product.name,
          product.gender,
          product.brand,
          product.collection,
          product.category,
        ]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase());

        return searchableFields.some((value) => value.includes(normalizedQuery));
      });
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 md:px-12 py-6 flex items-center justify-between ${
        isScrolled || isSearchOpen ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-8">
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium">
          <Link to="/collections" className="hover:text-gold transition-colors">Collections</Link>
          <Link to="/top-sellers" className="hover:text-gold transition-colors">Top Sellers</Link>
          <a href="#craftsmanship" className="hover:text-gold transition-colors">Craftsmanship</a>
          {isAdmin && <Link to="/admin" className="hover:text-gold transition-colors">Dashboard</Link>}
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link to="/">
          <h1 className="text-2xl md:text-3xl font-serif tracking-[0.3em] uppercase font-bold">Aureum</h1>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <button 
          className="hover:text-gold transition-colors"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>
        <button 
          className="hover:text-gold transition-colors"
          onClick={() => (user ? logout() : setIsAuthOpen(true))}
        >
          <User className="w-5 h-5" />
        </button>
        <Link to="/cart" className="hover:text-gold transition-colors relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-t border-gray-100 p-8 shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto relative">
              <div className="relative mb-8">
                <input 
                  type="text" 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our collection..." 
                  className="w-full bg-transparent border-b border-gold/40 py-4 px-2 text-ink placeholder:text-gray-400 focus:outline-none focus:border-gold transition-colors text-2xl font-serif italic"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
              </div>

              {/* Search Results */}
              <div className="space-y-6">
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id} 
                        to={`/product/${product.id}`} 
                        className="flex gap-4 group"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <div className="w-20 h-24 bg-paper overflow-hidden flex-shrink-0">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-sm font-serif group-hover:text-gold transition-colors">{product.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400">{product.brand} • {product.category}</p>
                          <p className="text-xs text-gold font-medium mt-1">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.length > 1 ? (
                  <p className="text-gray-400 text-sm italic py-4">No results found for "{searchQuery}"</p>
                ) : (
                  <div className="py-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-4">Popular Searches</p>
                    <div className="flex flex-wrap gap-3">
                      {['Signature', 'Oud', 'Rose', 'Solaris'].map((term) => (
                        <button 
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-4 py-2 border border-gray-100 text-[10px] uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <h1 className="text-2xl font-serif tracking-[0.3em] uppercase font-bold">Aureum</h1>
              </Link>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-8 text-xl font-serif italic">
              <Link to="/collections" onClick={() => setIsMenuOpen(false)}>Collections</Link>
              <Link to="/top-sellers" onClick={() => setIsMenuOpen(false)}>Top Sellers</Link>
              <a href="#craftsmanship" onClick={() => setIsMenuOpen(false)}>Craftsmanship</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
              <button 
                className="text-left hover:text-gold transition-colors"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthOpen(true);
                }}
              >
                Account
              </button>
            </div>
            <div className="mt-auto border-t pt-8 flex flex-col gap-4 text-xs uppercase tracking-widest">
              <button 
                className="text-left hover:text-gold transition-colors"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthOpen(true);
                }}
              >
                Sign In / Sign Up
              </button>
              <a href="/support">Support</a>
              <div className="flex gap-4 mt-4">
                <span className="text-gray-400">IG</span>
                <span className="text-gray-400">FB</span>
                <span className="text-gray-400">TW</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
};

export default Navbar;
