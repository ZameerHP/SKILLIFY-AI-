import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCw, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface FlashcardProps {
  data: Array<{
    front: string;
    back: string;
  }>;
}

export default function FlashcardView({ data }: FlashcardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<number[]>([]);

  const toggleMastery = () => {
    if (mastered.includes(currentIdx)) {
      setMastered(mastered.filter(i => i !== currentIdx));
    } else {
      setMastered([...mastered, currentIdx]);
    }
  };

  const next = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % data.length);
    }, 150);
  };

  const prev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + data.length) % data.length);
    }, 150);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-secondary uppercase tracking-widest">Card {currentIdx + 1} of {data.length}</span>
        <span className="text-xs text-white/40">{mastered.length} Mastered</span>
      </div>

      <div className="relative h-80 perspective-1000">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className="w-full h-full relative preserve-3d cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-center text-center border-white/20">
            <h3 className="text-2xl font-display font-bold leading-relaxed">{data[currentIdx].front}</h3>
            <div className="absolute bottom-6 text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
              <RotateCw size={12} /> Click to flip
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden glass-card p-12 flex flex-col items-center justify-center text-center border-secondary/30 rotate-y-180">
            <p className="text-lg text-white/80 leading-relaxed">{data[currentIdx].back}</p>
            <div className="absolute bottom-6 text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
              <RotateCw size={12} /> Click to flip
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button onClick={prev} className="p-4 glass rounded-xl hover:bg-white/10 transition-all">
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={toggleMastery}
          className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            mastered.includes(currentIdx) ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "glass text-white/60"
          }`}
        >
          <Star size={18} className={mastered.includes(currentIdx) ? "fill-emerald-400" : ""} /> 
          {mastered.includes(currentIdx) ? "Mastered" : "Mark as Mastered"}
        </button>

        <button onClick={next} className="p-4 glass rounded-xl hover:bg-white/10 transition-all">
          <ChevronRight size={24} />
        </button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
