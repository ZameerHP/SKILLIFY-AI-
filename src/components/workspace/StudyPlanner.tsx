import React, { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { generateStudyPlan } from "../../services/ai";

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState(2);
  const [plan, setPlan] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!subjects || !examDate) return;
    setIsLoading(true);
    try {
      const result = await generateStudyPlan(subjects, examDate, hours);
      setPlan(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {!plan ? (
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Calendar className="text-primary" size={20} />
            </div>
            <h3 className="text-xl font-display font-bold">Create Study Plan</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">Subjects (comma separated)</label>
              <input 
                type="text" 
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="Math, Physics, History..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">Exam Date</label>
                <input 
                  type="date" 
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">Study Hours/Day</label>
                <input 
                  type="number" 
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
          >
            {isLoading ? "Generating Plan..." : "Generate AI Study Plan"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold">Your AI Study Schedule</h3>
            <button onClick={() => setPlan(null)} className="text-xs text-white/40 hover:text-white">Reset</button>
          </div>
          
          <div className="space-y-4">
            {plan.map((day, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Clock className="text-accent" size={16} />
                  </div>
                  <h4 className="font-bold text-white">{day.day}</h4>
                </div>
                <ul className="space-y-3">
                  {day.tasks.map((task: string, j: number) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-white/60">
                      <div className="mt-1 w-4 h-4 rounded border border-white/20 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
