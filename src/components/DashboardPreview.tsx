import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BarChart3, Clock, TrendingUp, CheckCircle2, Zap } from "lucide-react";

export default function DashboardPreview() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const getStat = (type: string) => stats.find(s => s.type === type)?.total || 0;

  return (
    <section className="py-24 bg-navy-800/50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-navy-900 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Track Your <span className="text-secondary">Growth</span> in Real-Time
            </h2>
            <p className="text-lg text-white/60 mb-10 leading-relaxed">
              Our dashboard gives you a bird's-eye view of your learning progress. 
              Identify weak spots, track study hours, and celebrate your wins 
              with interactive charts and AI-driven insights.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: TrendingUp, text: "AI-driven grade predictions", color: "text-emerald-400" },
                { icon: Clock, text: "Study streak and time tracking", color: "text-orange-400" },
                { icon: CheckCircle2, text: "Mastery level per subject", color: "text-primary" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-semibold text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Dashboard Mockup */}
            <div className="glass-card p-6 border-white/20 shadow-2xl relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-display font-bold">Study Overview</h3>
                  <p className="text-xs text-white/40">Last 7 days activity</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <BarChart3 size={16} className="text-accent" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3 items-end h-40 mb-8">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className="bg-gradient-to-t from-primary to-accent rounded-t-md w-full"
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Tools Used</p>
                  <p className="text-2xl font-display font-bold">{stats.reduce((acc, s) => acc + s.total, 0)}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Quizzes Done</p>
                  <p className="text-2xl font-display font-bold">{getStat("quiz")}</p>
                </div>
              </div>
            </div>

            {/* Floating Widget 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-6 w-48 glass-card p-4 border-accent/30 z-20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Zap size={14} className="text-accent" />
                </div>
                <span className="text-xs font-bold">New Mastery!</span>
              </div>
              <p className="text-[10px] text-white/60">You've mastered "Organic Chemistry: Alkanes"</p>
            </motion.div>

            {/* Floating Widget 2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-10 w-56 glass-card p-4 border-secondary/30 z-20"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold">Daily Goal</span>
                <span className="text-[10px] text-accent">80%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-secondary" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
