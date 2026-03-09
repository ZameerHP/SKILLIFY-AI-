import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const extractTextFromFile = async (base64Data: string, mimeType: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Extract all text from this file. If it's an image of notes, perform OCR. If it's a document, extract the full text content. Maintain the structure and formatting. Return ONLY the extracted text." }
        ]
      }
    ]
  });
  return response.text;
};

export const generateExplanation = async (text: string, selection: string, language: string = "English") => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Context: ${text}\n\nExplain this specific part in ${language}: "${selection}". Provide a simplified explanation, step-by-step breakdown, and examples. Use a friendly, encouraging tone for a student.`,
  });
  return response.text;
};

export const generateSummary = async (text: string, mode: string, language: string = "English") => {
  const prompts: Record<string, string> = {
    quick: "Provide a concise 2-3 paragraph summary.",
    exam: "Focus on key facts, dates, and definitions likely to appear on an exam.",
    bullets: "Summarize the content using clear bullet points.",
    concepts: "Identify and explain the core concepts found in this text."
  };
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Content: ${text}\n\nTask: ${prompts[mode] || prompts.quick} Language: ${language}.`,
  });
  return response.text;
};

export const generateQuiz = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a comprehensive quiz based on this content: ${text}. Include 5 Multiple Choice Questions, 3 True/False, and 2 Short Answer questions. Return the response in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, description: "mcq, tf, or short" },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Only for mcq" },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["id", "type", "question", "answer", "explanation"]
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateFlashcards = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a set of 10 flashcards from this content: ${text}. Each card should have a front (question/term) and a back (answer/definition). Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING }
          },
          required: ["front", "back"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateDiagram = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this content, generate a Mermaid.js diagram (flowchart or mindmap) that visualizes the main process or structure. Return ONLY the mermaid code block starting with 'graph TD' or 'mindmap'. Content: ${text}`,
  });
  return response.text;
};

export const generateStudyPlan = async (subjects: string, examDate: string, hours: number) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a study plan for these subjects: ${subjects}. The exam is on ${examDate}. I can study ${hours} hours per day. Provide a daily schedule for the next 7 days. Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["day", "tasks"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};
