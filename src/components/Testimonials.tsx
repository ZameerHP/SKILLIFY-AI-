import React from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../constants";

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Loved by <span className="text-accent">Students</span> Worldwide
          </h2>
          <p className="text-white/60 text-lg">
            Don't just take our word for it. Here's what the community thinks.
          </p>
        </div>

        <div className="flex overflow-x-auto pb-12 gap-8 no-scrollbar snap-x snap-mandatory">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[350px] md:min-w-[400px] glass-card p-8 snap-center relative"
            >
              <Quote className="absolute top-6 right-8 text-white/5" size={60} />
              
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className="text-accent fill-accent" />
                ))}
              </div>

              <p className="text-lg text-white/80 mb-8 italic leading-relaxed">
                "{t.text}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border-2 border-primary/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
