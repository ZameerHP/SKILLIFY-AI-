import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, FileText, X, Loader2, CheckCircle } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { extractTextFromFile } from "../../services/ai";

export default function FileUpload() {
  const { setActiveFile, setExtractedText, setIsWorkspaceOpen } = useWorkspace();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (file: File) => {
    console.log("Starting upload for:", file.name);
    
    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        let errorMessage = "Upload failed";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUploadProgress(60);

      let text = data.extractedText || "";

      // Only call Gemini if text wasn't already extracted by the backend (for PDF and Images)
      if (!text) {
        try {
          text = await extractTextFromFile(data.content, data.type);
        } catch (aiError) {
          console.error("AI extraction failed:", aiError);
          text = "AI extraction failed. Please try a different file format or ensure the file is not corrupted.";
        }
      }

      setUploadProgress(100);
      setTimeout(() => {
        setActiveFile(data);
        setExtractedText(text || "No text could be extracted from this file.");
        setIsWorkspaceOpen(true);
        setIsUploading(false);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative glass-card p-12 border-2 border-dashed transition-all cursor-pointer ${
          isDragging ? "border-accent bg-accent/5" : "border-white/10 hover:border-white/20"
        }`}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
        />

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
            <Upload className="text-primary" size={32} />
          </div>
          <h3 className="text-xl font-display font-bold mb-2">Upload Study Material</h3>
          <p className="text-white/50 text-sm mb-6">
            Drag and drop your notes, PDFs, or textbook images.<br />
            Supports PDF, DOCX, TXT, and Images.
          </p>
          
          <AnimatePresence>
            {isUploading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-accent">Processing...</span>
                  <span className="text-xs text-white/40">{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </motion.div>
            ) : (
              <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all">
                Select File
              </button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
