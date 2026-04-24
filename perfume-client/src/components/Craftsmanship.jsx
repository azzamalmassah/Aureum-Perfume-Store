import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Leaf, ShieldCheck } from 'lucide-react';

const Craftsmanship = () => {
  return (
    <section id="craftsmanship" className="py-24 px-6 md:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-[0.4em] text-gold font-semibold mb-4 block">The Art of Creation</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">Crafted with <br /> <span className="italic">Uncompromising Detail</span></h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                From the selection of the rarest raw materials to the final bottling process, every step is a testament to our century-old heritage of high perfumery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 bg-paper flex items-center justify-center text-gold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif">Rare Ingredients</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We source only the finest natural essences from the most remote corners of the world.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 bg-paper flex items-center justify-center text-gold">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif">Sustainable Sourcing</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Our commitment to nature ensures that every ingredient is harvested with respect for the environment.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <div className="w-12 h-12 bg-paper flex items-center justify-center text-gold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif">Masterful Blending</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Each formula is aged for months to achieve the perfect balance and longevity.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative aspect-[4/5] overflow-hidden rounded-t-full"
            >
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gold/5" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute -bottom-8 -left-8 bg-paper p-10 border border-gold/20 max-w-xs hidden md:block"
            >
              <p className="text-xs uppercase tracking-widest text-gold font-bold mb-4">The Aureum Seal</p>
              <p className="text-sm font-serif italic text-gray-600 leading-relaxed">
                "Our fragrances are not just scents, they are liquid memories, captured in glass and sealed with gold."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Craftsmanship;
