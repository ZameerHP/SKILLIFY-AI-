import React from "react";
import { motion } from "motion/react";
import { Check, Zap } from "lucide-react";
import { PRICING_PLANS } from "../constants";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Simple, <span className="text-primary">Transparent</span> Pricing
          </h2>
          <p className="text-white/60 text-lg">
            Choose the plan that fits your learning goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-8 flex flex-col relative ${
                plan.isPopular ? "border-primary/50 shadow-[0_0_40px_rgba(37,99,255,0.15)] scale-105 z-10" : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-display font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/40 text-sm">/month</span>
                </div>
                <p className="text-sm text-white/50">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${
                  plan.isPopular
                    ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                    : "glass hover:bg-white/10 text-white"
                }`}
              >
                {plan.name === "Free" ? "Get Started" : "Upgrade to Pro"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
