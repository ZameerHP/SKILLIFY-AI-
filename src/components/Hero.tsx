import React from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, Zap, BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-glow opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary/20 blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="text-accent" size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-display font-bold leading-[1.1] mb-6">
              Your AI Teacher for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Every Subject.</span>
            </h1>
            
            <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">
              Skillify uses advanced neural networks to help you master any topic. 
              Upload your materials and let AI generate quizzes, flashcards, and 
              personalized study guides in seconds.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                Start Learning <Zap size={18} className="fill-white" />
              </button>
              <button className="px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95">
                Try AI Tools
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/seed/${i + 10}/100/100`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-navy-900"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <p className="text-sm text-white/50">
                Joined by <span className="text-white font-semibold">10,000+</span> students this week
              </p>
            </div>
          </motion.div>

          {/* Floating Cards Visual */}
          <div className="relative h-[500px] hidden lg:block">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-72 glass-card p-6 rotate-3 z-20"
            >
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                <Brain className="text-accent" />
              </div>
              <h3 className="font-display font-bold mb-2">AI Explainer</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                "Quantum physics is like a video game where things only exist when you look at them..."
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-10 left-0 w-64 glass-card p-6 -rotate-6 z-10"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-primary" />
              </div>
              <h3 className="font-display font-bold mb-2">Quiz Generated</h3>
              <div className="space-y-2">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary" />
                </div>
                <p className="text-[10px] text-white/40">Score: 85% • 12/15 Correct</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ x: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 glass-card p-5 rotate-12"
            >
              <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="text-secondary" />
              </div>
              <h3 className="text-sm font-display font-bold mb-1">Flashcard #42</h3>
              <p className="text-[11px] text-white/60">What is the mitochondria?</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
