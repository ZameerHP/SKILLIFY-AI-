import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Filter, FileText, Zap, Layout, BookOpen, Trash2, ExternalLink } from "lucide-react";

export default function StudyLibrary() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/library")
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "summary": return <FileText className="text-blue-400" size={18} />;
      case "quiz": return <Zap className="text-yellow-400" size={18} />;
      case "flashcards": return <Layout className="text-purple-400" size={18} />;
      case "note": return <BookOpen className="text-emerald-400" size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search your library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-primary"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          {["all", "summary", "quiz", "flashcards", "note"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === f ? "bg-primary text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"><ExternalLink size={14} /></button>
                <button className="p-2 hover:bg-rose-500/10 rounded-lg text-white/40 hover:text-rose-500"><Trash2 size={14} /></button>
              </div>
            </div>
            
            <h4 className="font-display font-bold mb-2 truncate">{item.title}</h4>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">
              Saved {new Date(item.created_at).toLocaleDateString()}
            </p>
            
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all">
              Open Session
            </button>
          </motion.div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-white/10" size={32} />
            </div>
            <p className="text-white/40">No items found in your library.</p>
          </div>
        )}
      </div>
    </div>
  );
}
