import React from 'react';
import { Instagram, Twitter, Facebook, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white py-24 px-6 md:px-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link to="/">
              <h1 className="text-3xl font-serif tracking-[0.3em] uppercase font-bold">Aureum</h1>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              A luxury fragrance house offering a curated collection of high-perfumery, meticulously crafted in Grasse since 1924.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gold">Explore</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/collections" className="hover:text-gold transition-colors">All Collections</Link></li>
              <li><Link to="/top-sellers" className="hover:text-gold transition-colors">Top Sellers</Link></li>
              <li><a href="#craftsmanship" className="hover:text-gold transition-colors">Craftsmanship</a></li>
              <li><a href="#about" className="hover:text-gold transition-colors">Our Story</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gold">Support</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gold transition-colors">Customer Care</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gold">Boutiques</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>Paris • 12 Rue de la Paix</li>
              <li>London • 45 Bond Street</li>
              <li>New York • 789 Madison Ave</li>
              <li>Tokyo • 3-4-5 Ginza</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100 gap-8">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            © 2026 Aureum Fragrances. All Rights Reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-gold transition-colors"
          >
            Back to Top <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
