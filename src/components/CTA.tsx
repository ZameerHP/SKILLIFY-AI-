import React from "react";
import { motion } from "motion/react";
import { Zap, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto relative rounded-[40px] overflow-hidden"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        
        <div className="relative z-10 py-20 px-10 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="inline-block mb-8"
          >
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
              <Zap className="text-primary fill-primary" size={40} />
            </div>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-8 max-w-3xl mx-auto leading-tight">
            Ready to Ace Your <span className="text-navy-900">Next Exam?</span>
          </h2>
          
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands of students who are already using Skillify to study 10x faster. 
            Start your AI learning journey today for free.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-10 py-5 bg-navy-900 text-white font-bold rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
              Start Learning Now <Sparkles size={20} className="text-accent" />
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95">
              View All Tools
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
