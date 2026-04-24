import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-paper text-center overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-gold font-semibold mb-4 block">The Inner Circle</span>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">Join the <br /> <span className="italic">Aureum Society</span></h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
            Be the first to experience our new collections, receive exclusive invitations to our events, and discover the secrets of high perfumery.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input 
            type="email" 
            placeholder="Your Email Address" 
            className="w-full bg-transparent border-b border-gold/40 py-4 px-2 text-ink placeholder:text-gray-400 focus:outline-none focus:border-gold transition-colors text-center"
          />
          <button className="mt-8 group flex items-center gap-4 mx-auto text-xs uppercase tracking-[0.3em] font-bold">
            Subscribe Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Newsletter;
