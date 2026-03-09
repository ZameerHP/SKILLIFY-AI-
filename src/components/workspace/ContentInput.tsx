import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, FileText, Type, Send, Sparkles, Loader2 } from "lucide-react";
import FileUpload from "./FileUpload";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function ContentInput() {
  const [activeTab, setActiveTab] = useState<"upload" | "write">("upload");
  const [textContent, setTextContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { setExtractedText, setIsWorkspaceOpen, setActiveFile } = useWorkspace();

  const handleTextSubmit = async () => {
    if (!textContent.trim()) return;
    setIsProcessing(true);
    
    // Helper to safely encode UTF-8 to Base64
    const toBase64 = (str: string) => {
      try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => 
          String.fromCharCode(parseInt(p1, 16))
        ));
      } catch (e) {
        console.error("Base64 encoding failed:", e);
        return "";
      }
    };

    try {
      const response = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Manual Entry",
          type: "text/plain",
          content: toBase64(textContent)
        })
      });

      if (!response.ok) throw new Error("Failed to save content");
      
      const data = await response.json();
      
      setActiveFile(data);
      setExtractedText(textContent);
      setIsWorkspaceOpen(true);
    } catch (error) {
      console.error(error);
      alert("Failed to process content. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === "upload" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-white/40 hover:bg-white/10"
          }`}
        >
          <Upload size={18} /> Upload File
        </button>
        <button
          onClick={() => setActiveTab("write")}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === "write" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-white/40 hover:bg-white/10"
          }`}
        >
          <Type size={18} /> Write Content
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FileUpload />
          </motion.div>
        ) : (
          <motion.div
            key="write"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8"
          >
            <div className="mb-6">
              <h3 className="text-xl font-display font-bold mb-2">Write or Paste Content</h3>
              <p className="text-white/50 text-sm">
                Paste your notes, essay, or any text you want to study.
              </p>
            </div>

            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste your content here..."
              className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-6 text-white outline-none focus:border-primary transition-all resize-none mb-6 font-sans leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                onClick={handleTextSubmit}
                disabled={!textContent.trim() || isProcessing}
                className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Start Learning <Sparkles size={18} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
