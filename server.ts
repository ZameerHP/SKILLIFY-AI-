import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import mammoth from "mammoth";

console.log("SERVER STARTING AT TOP LEVEL...");
dotenv.config();

const dbPath = process.env.NODE_ENV === "production" ? "/tmp/skillify.db" : "skillify.db";
const db = new Database(dbPath);

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS library (
    id TEXT PRIMARY KEY,
    file_id TEXT,
    type TEXT,
    title TEXT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(file_id) REFERENCES files(id)
  );

  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    value INTEGER,
    date DATE DEFAULT CURRENT_DATE
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // Health check
  app.get("/api/health", (req, res) => {
    console.log("Health check requested");
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // Multer setup for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
  });

  // API Routes
  app.post("/api/upload", upload.single("file"), async (req: any, res) => {
    console.log("Upload request received");
    try {
      const file = req.file;
      if (!file) {
        console.error("No file in request");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(`Processing file: ${file.originalname} (${file.mimetype})`);
      const id = Math.random().toString(36).substring(7);
      const name = file.originalname;
      const type = file.mimetype;
      
      let content = "";
      let extractedText = "";

      try {
        if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          extractedText = result.value;
          content = file.buffer.toString('base64');
        } else if (type === "text/plain") {
          extractedText = file.buffer.toString('utf8');
          content = file.buffer.toString('base64');
        } else {
          content = file.buffer.toString('base64');
        }
      } catch (extractError) {
        console.error("Extraction error:", extractError);
        content = file.buffer.toString('base64');
      }

      try {
        db.prepare("INSERT INTO files (id, name, type, content) VALUES (?, ?, ?, ?)").run(id, name, type, content);
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({ error: "Database storage failed" });
      }

      console.log("Upload successful");
      res.json({ id, name, type, content, extractedText });
    } catch (error: any) {
      console.error("General upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload file" });
    }
  });

  app.post("/api/files", (req, res) => {
    const { name, type, content } = req.body;
    const id = Math.random().toString(36).substring(7);
    try {
      db.prepare("INSERT INTO files (id, name, type, content) VALUES (?, ?, ?, ?)").run(id, name, type, content);
      res.json({ id, name, type, content });
    } catch (error: any) {
      console.error("Error saving manual file:", error);
      res.status(500).json({ error: "Failed to save content" });
    }
  });

  app.get("/api/library", (req, res) => {
    const items = db.prepare("SELECT * FROM library ORDER BY created_at DESC").all();
    res.json(items);
  });

  app.post("/api/library", (req, res) => {
    const { file_id, type, title, data } = req.body;
    const id = Math.random().toString(36).substring(7);
    db.prepare("INSERT INTO library (id, file_id, type, title, data) VALUES (?, ?, ?, ?, ?)").run(id, file_id, type, title, JSON.stringify(data));
    res.json({ id, success: true });
  });

  app.get("/api/stats", (req, res) => {
    const stats = db.prepare("SELECT type, SUM(value) as total FROM progress GROUP BY type").all();
    res.json(stats);
  });

  app.post("/api/stats", (req, res) => {
    const { type, value } = req.body;
    db.prepare("INSERT INTO progress (type, value) VALUES (?, ?)").run(type, value);
    res.json({ success: true });
  });

  // Auth Routes
  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password } = req.body;
    const id = Math.random().toString(36).substring(7);
    try {
      db.prepare("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)").run(id, name, email, password);
      res.json({ success: true, user: { id, name, email } });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Signup failed" });
      }
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });

  // ERROR HANDLER
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
