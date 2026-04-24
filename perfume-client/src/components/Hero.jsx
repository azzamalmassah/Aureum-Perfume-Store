import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[800px] w-full overflow-hidden flex items-center justify-center bg-[#1A1A1A]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1920&auto=format&fit=crop" 
          alt="Luxury Fragrance" 
          className="w-full h-full object-cover opacity-70 scale-105 animate-slow-zoom"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Vertical Label */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-12 z-10">
        <span className="vertical-rl text-[10px] uppercase tracking-[0.5em] text-white/60 font-medium">
          The Art of High Perfumery
        </span>
        <div className="w-px h-24 bg-white/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block text-xs md:text-sm uppercase tracking-[0.4em] text-gold font-semibold mb-6"
        >
          Est. 1924 • Paris
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-8 italic"
        >
          The Essence of <br />
          <span className="not-italic font-bold tracking-tight">Pure Gold</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/80 text-lg md:text-xl font-light max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Discover a collection of rare fragrances crafted with the world's most precious ingredients.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            to="/collections" 
            className="group relative px-10 py-5 bg-gold text-white uppercase tracking-widest text-xs font-bold transition-all duration-300 hover:bg-white hover:text-gold overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <button className="px-10 py-5 border border-white/30 text-white uppercase tracking-widest text-xs font-bold hover:bg-white/10 transition-colors">
            Our Story
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
        <span className="text-[10px] uppercase tracking-widest text-white/40">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
