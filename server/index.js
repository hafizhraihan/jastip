import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import {
  ensureDirectories,
  getSiteData,
  saveSiteData,
  resetSiteData,
  getPlaytestSignups,
  addPlaytestSignup,
  deletePlaytestSignup,
  UPLOADS_DIR
} from "./storage.js";
import {
  verifyCredentials,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getAuthenticatedUser,
  requireAdmin
} from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

ensureDirectories();

const app = express();
const PORT = Number(process.env.PORT || 5173);
const IS_PROD = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Multer configuration for image uploads
const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureDirectories();
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = allowedExtensions.has(ext) ? ext : ".png";
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `jastip-${unique}${safeExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (!allowedExtensions.has(ext)) {
      return cb(new Error("Only PNG, JPG, WEBP, GIF, and SVG images are allowed."));
    }
    cb(null, true);
  }
});

// Serve uploaded images & static assets
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/assets", express.static(path.join(ROOT_DIR, "public", "assets")));

// Public content API
app.get("/api/content", (_req, res) => {
  res.json(getSiteData());
});

// Public playtest signup
app.post("/api/playtest-signup", (req, res) => {
  const { name, email, device } = req.body || {};
  if (!name || !String(name).trim() || !email || !String(email).includes("@")) {
    return res.status(400).json({ error: "Please provide a valid name and email address." });
  }
  const entry = addPlaytestSignup({ name, email, device });
  res.status(201).json(entry);
});

// Auth routes
app.get("/api/auth/me", (req, res) => {
  const session = getAuthenticatedUser(req);
  if (!session) {
    return res.json({ authenticated: false });
  }
  res.json({ authenticated: true, username: session.sub });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!verifyCredentials(username, password)) {
    return res.status(401).json({ error: "Invalid username or password." });
  }
  const token = createSessionToken(String(username).trim());
  setSessionCookie(res, token);
  res.json({ authenticated: true, username: String(username).trim() });
});

app.post("/api/auth/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ authenticated: false });
});

// Protected Admin CMS routes
app.put("/api/content", requireAdmin, (req, res) => {
  const saved = saveSiteData(req.body || {});
  res.json(saved);
});

app.post("/api/content/reset", requireAdmin, (_req, res) => {
  const reset = resetSiteData();
  res.json(reset);
});

app.post("/api/upload", requireAdmin, (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Upload failed." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

app.get("/api/playtest-signups", requireAdmin, (_req, res) => {
  res.json(getPlaytestSignups());
});

app.delete("/api/playtest-signups/:id", requireAdmin, (req, res) => {
  const updated = deletePlaytestSignup(req.params.id);
  res.json(updated);
});

// Frontend serving (Vite dev middleware or production dist)
async function startServer() {
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT_DIR, "dist");
    app.use(express.static(distDir));
    app.use((_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`JASTIP Board Game Website running at http://127.0.0.1:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

