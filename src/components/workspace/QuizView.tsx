import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from "lucide-react";

interface QuizProps {
  data: {
    questions: Array<{
      id: string;
      type: string;
      question: string;
      options?: string[];
      answer: string;
      explanation: string;
    }>;
  };
}

export default function QuizView({ data }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = data.questions[currentIdx];

  const handleAnswer = (ans: string) => {
    if (showResult) return;
    setAnswers({ ...answers, [currentQuestion.id]: ans });
  };

  const next = () => {
    if (currentIdx < data.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate score
      let s = 0;
      data.questions.forEach(q => {
        if (answers[q.id]?.toLowerCase() === q.answer.toLowerCase()) s++;
      });
      setScore(s);
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-primary" size={48} />
        </div>
        <h3 className="text-3xl font-display font-bold mb-2">Quiz Complete!</h3>
        <p className="text-white/60 mb-8">You scored {score} out of {data.questions.length}</p>
        
        <div className="space-y-4 text-left mb-8">
          {data.questions.map((q, i) => (
            <div key={i} className="p-4 glass rounded-xl border-white/5">
              <p className="text-sm font-bold mb-1">{q.question}</p>
              <p className={`text-xs ${answers[q.id]?.toLowerCase() === q.answer.toLowerCase() ? "text-emerald-400" : "text-rose-400"}`}>
                Your answer: {answers[q.id] || "None"}
              </p>
              <p className="text-xs text-white/40 mt-2 italic">{q.explanation}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={() => { setCurrentIdx(0); setAnswers({}); setShowResult(false); }}
          className="px-8 py-3 bg-primary rounded-xl font-bold flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={18} /> Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-accent uppercase tracking-widest">Question {currentIdx + 1} of {data.questions.length}</span>
        <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-accent" style={{ width: `${((currentIdx + 1) / data.questions.length) * 100}%` }} />
        </div>
      </div>

      <h3 className="text-xl font-display font-bold leading-relaxed">{currentQuestion.question}</h3>

      <div className="space-y-3">
        {currentQuestion.type === "mcq" ? (
          currentQuestion.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className={`w-full p-4 text-left rounded-xl border transition-all ${
                answers[currentQuestion.id] === opt 
                  ? "bg-primary/20 border-primary text-white" 
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              {opt}
            </button>
          ))
        ) : currentQuestion.type === "tf" ? (
          ["True", "False"].map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className={`w-full p-4 text-left rounded-xl border transition-all ${
                answers[currentQuestion.id] === opt 
                  ? "bg-primary/20 border-primary text-white" 
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              {opt}
            </button>
          ))
        ) : (
          <textarea
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary h-32"
          />
        )}
      </div>

      <button
        onClick={next}
        disabled={!answers[currentQuestion.id]}
        className="w-full py-4 bg-primary disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2"
      >
        {currentIdx === data.questions.length - 1 ? "Finish Quiz" : "Next Question"} <ChevronRight size={18} />
      </button>
    </div>
  );
}
