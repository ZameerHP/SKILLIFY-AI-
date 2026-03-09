import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { useWorkspace } from "../../context/WorkspaceContext";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; text: string }>>([
    { role: "bot", text: "Hi! I'm your Skillify Assistant. How can I help you study today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"chat" | "test">("chat");
  const { extractedText } = useWorkspace();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startTest = async () => {
    setMode("test");
    setMessages([{ role: "bot", text: "Let's start the test! I'll ask you questions based on your material. Ready? Here's the first one:" }]);
    setIsLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Context: ${extractedText.substring(0, 5000)}\n\nTask: Ask the user a challenging question based on this context to test their knowledge.`,
      });
      setMessages(prev => [...prev, { role: "bot", text: response.text || "Could not generate question." }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      let prompt = "";
      if (mode === "test") {
        prompt = `Context: ${extractedText.substring(0, 5000)}\n\nUser Answer: ${userMsg}\n\nTask: Evaluate the user's answer. Tell them if they are correct, explain why, and then ask the NEXT question.`;
      } else {
        prompt = `Context from study material: ${extractedText.substring(0, 5000)}\n\nUser Question: ${userMsg}\n\nProvide a concise, student-friendly, step-by-step answer.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      setMessages(prev => [...prev, { role: "bot", text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "bot", text: "Error connecting to AI. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center text-white z-[70] hover:scale-110 active:scale-95 transition-all"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-navy-900"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 w-[400px] h-[600px] glass-card border-white/20 flex flex-col z-[70] overflow-hidden"
          >
            <div className="p-6 bg-primary flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white">Skillify AI</h3>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">{mode === "chat" ? "Assistant Mode" : "Test Mode"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setMode("chat"); setMessages([{ role: "bot", text: "Switched to Assistant Mode. How can I help?" }]); }}
                  className={`p-2 rounded-lg transition-all ${mode === "chat" ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}
                  title="Chat Mode"
                >
                  <MessageSquare size={16} />
                </button>
                <button 
                  onClick={startTest}
                  className={`p-2 rounded-lg transition-all ${mode === "test" ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}
                  title="Test Mode"
                >
                  <Sparkles size={16} />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === "user" ? "bg-primary text-white" : "bg-white/5 text-white/80 border border-white/10"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <Loader2 className="animate-spin text-accent" size={18} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-navy-900/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything about your study material..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-primary transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-primary/80"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
