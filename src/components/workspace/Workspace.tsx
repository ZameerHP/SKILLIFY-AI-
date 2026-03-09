import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Maximize2, Minimize2, Save, Copy, 
  BookOpen, Zap, Layout, FileText, 
  BarChart3, MessageSquare, Settings,
  ChevronRight, Languages, Loader2, Calendar
} from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import ReactMarkdown from "react-markdown";
import { generateExplanation, generateSummary, generateQuiz, generateFlashcards, generateDiagram } from "../../services/ai";
import QuizView from "./QuizView";
import FlashcardView from "./FlashcardView";
import DiagramView from "./DiagramView";

import StudyPlanner from "./StudyPlanner";
import StudyLibrary from "./StudyLibrary";

export default function Workspace() {
  const { isWorkspaceOpen, setIsWorkspaceOpen, activeFile, extractedText, language, setLanguage } = useWorkspace();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toolOutput, setToolOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelection = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) setSelection(selectedText);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const runTool = async (tool: string) => {
    setActiveTool(tool);
    if (tool === "planner" || tool === "library") {
      setToolOutput(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setToolOutput(null);

    try {
      let result;
      switch (tool) {
        case "explain":
          result = await generateExplanation(extractedText, selection || extractedText.substring(0, 500), language);
          break;
        case "summary":
          result = await generateSummary(extractedText, "quick", language);
          break;
        case "quiz":
          result = await generateQuiz(extractedText);
          break;
        case "flashcards":
          result = await generateFlashcards(extractedText);
          break;
        case "diagram":
          result = await generateDiagram(extractedText);
          break;
      }
      setToolOutput(result);
      
      // Save to stats
      await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: tool, value: 1 })
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLibrary = async () => {
    if (!toolOutput || !activeTool) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: activeFile?.id,
          type: activeTool,
          title: `${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}: ${activeFile?.name}`,
          data: toolOutput
        })
      });
      if (response.ok) {
        alert("Saved to library!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save to library.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isWorkspaceOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] bg-navy-900 flex overflow-hidden"
    >
      {/* Sidebar Navigation */}
      <div className="w-20 border-r border-white/10 flex flex-col items-center py-8 gap-8 bg-navy-900/50">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-4">
          <Zap className="text-white fill-white" size={20} />
        </div>
        
        <div className="flex flex-col gap-6">
          {[
            { id: "explain", icon: BookOpen, label: "Explainer" },
            { id: "summary", icon: FileText, label: "Summarizer" },
            { id: "quiz", icon: Zap, label: "Quiz" },
            { id: "flashcards", icon: Layout, label: "Flashcards" },
            { id: "diagram", icon: BarChart3, label: "Diagram" },
            { id: "planner", icon: Calendar, label: "Planner" },
            { id: "library", icon: MessageSquare, label: "Library" },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => runTool(tool.id)}
              className={`p-3 rounded-xl transition-all group relative ${
                activeTool === tool.id ? "bg-primary text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              <tool.icon size={24} />
              <span className="absolute left-full ml-4 px-2 py-1 bg-navy-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {tool.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <button className="text-white/40 hover:text-white group relative">
            <Settings size={24} />
            <span className="absolute left-full ml-4 px-2 py-1 bg-navy-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Settings</span>
          </button>
          <button 
            onClick={() => setIsWorkspaceOpen(false)} 
            className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all group relative"
          >
            <X size={24} />
            <span className="absolute left-full ml-4 px-2 py-1 bg-navy-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-bold truncate max-w-md">{activeFile?.name}</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Languages size={14} className="text-accent" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (toolOutput) {
                  saveToLibrary();
                } else {
                  // Save the whole document as a note
                  setActiveTool("note");
                  setToolOutput(extractedText);
                  setTimeout(() => saveToLibrary(), 100);
                }
              }}
              disabled={isSaving}
              className="px-4 py-1.5 glass rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} 
              {isSaving ? "Saving..." : "Save to Library"}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Document Viewer */}
          <div className="flex-1 overflow-y-auto p-12 bg-navy-800/30" onMouseUp={handleSelection}>
            <div className="max-w-3xl mx-auto glass-card p-12 min-h-full">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{extractedText}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Tool Panel */}
          <AnimatePresence>
            {activeTool && (
              <motion.div
                initial={{ x: 400 }}
                animate={{ x: 0 }}
                exit={{ x: 400 }}
                className="w-[450px] border-l border-white/10 bg-navy-900/80 backdrop-blur-xl flex flex-col"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-display font-bold capitalize">{activeTool}</h3>
                  <button onClick={() => setActiveTool(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-primary" size={40} />
                      <p className="text-sm text-white/40 font-medium">AI is thinking...</p>
                    </div>
                  ) : activeTool === "planner" ? (
                    <StudyPlanner />
                  ) : activeTool === "library" ? (
                    <StudyLibrary />
                  ) : toolOutput ? (
                    <div className="space-y-6">
                      {activeTool === "quiz" ? (
                        <QuizView data={toolOutput} />
                      ) : activeTool === "flashcards" ? (
                        <FlashcardView data={toolOutput} />
                      ) : activeTool === "diagram" ? (
                        <DiagramView code={toolOutput} />
                      ) : (
                        <div className="prose prose-invert prose-sm">
                          <ReactMarkdown>{toolOutput}</ReactMarkdown>
                          <div className="mt-8 flex gap-3">
                            <button 
                              onClick={() => copyToClipboard(toolOutput)}
                              className="flex-1 py-2.5 glass rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                            >
                              <Copy size={14} /> {isCopied ? "Copied!" : "Copy"}
                            </button>
                            <button 
                              onClick={saveToLibrary} 
                              disabled={isSaving}
                              className="flex-1 py-2.5 bg-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                              {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} 
                              {isSaving ? "Saving..." : "Save Note"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Zap className="text-white/20" size={32} />
                      </div>
                      <p className="text-sm text-white/40">Select a tool from the sidebar to start processing your content.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
