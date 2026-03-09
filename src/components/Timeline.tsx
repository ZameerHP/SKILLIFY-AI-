import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { TIMELINE_STEPS } from "../constants";

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            The Skillify <span className="text-primary">Journey</span>
          </h2>
          <p className="text-white/60 text-lg">
            How we transform your study materials into mastery.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="w-full h-full bg-gradient-to-b from-primary via-accent to-secondary"
            />
          </div>

          <div className="space-y-32">
            {TIMELINE_STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={step.title} className="relative flex items-center justify-between w-full">
                  {/* Content Side */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`w-[45%] ${isEven ? "text-right" : "order-last text-left"}`}
                  >
                    <h3 className="text-2xl font-display font-bold mb-3 text-white">
                      {step.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-navy-900 border-4 border-primary z-10 shadow-[0_0_15px_rgba(37,99,255,0.5)]"
                  />

                  {/* Empty Side for spacing */}
                  <div className="w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
