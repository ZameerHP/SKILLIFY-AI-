import React, { createContext, useContext, useState, useEffect } from "react";

interface FileData {
  id: string;
  name: string;
  type: string;
  content: string;
  extractedText?: string;
}

interface WorkspaceContextType {
  activeFile: FileData | null;
  setActiveFile: (file: FileData | null) => void;
  extractedText: string;
  setExtractedText: (text: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  isWorkspaceOpen: boolean;
  setIsWorkspaceOpen: (open: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFile, setActiveFile] = useState<FileData | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [language, setLanguage] = useState("English");
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  return (
    <WorkspaceContext.Provider
      value={{
        activeFile,
        setActiveFile,
        extractedText,
        setExtractedText,
        language,
        setLanguage,
        isWorkspaceOpen,
        setIsWorkspaceOpen,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return context;
};
