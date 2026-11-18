import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defaultSiteData } from "./defaultData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

export const DATA_DIR = path.join(ROOT_DIR, "data");
export const UPLOADS_DIR = path.join(ROOT_DIR, "public", "uploads");
const SITE_DATA_PATH = path.join(DATA_DIR, "site-data.json");
const SIGNUPS_PATH = path.join(DATA_DIR, "playtest-signups.json");

export function ensureDirectories() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  if (!fs.existsSync(SITE_DATA_PATH)) {
    atomicWriteJson(SITE_DATA_PATH, defaultSiteData);
  }
  if (!fs.existsSync(SIGNUPS_PATH)) {
    atomicWriteJson(SIGNUPS_PATH, []);
  }
}

function atomicWriteJson(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, filePath);
}

export function getSiteData() {
  ensureDirectories();
  try {
    const raw = fs.readFileSync(SITE_DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...defaultSiteData,
      ...parsed,
      hero: { ...defaultSiteData.hero, ...(parsed.hero || {}) },
      hybrid: { ...defaultSiteData.hybrid, ...(parsed.hybrid || {}) },
      footer: { ...defaultSiteData.footer, ...(parsed.footer || {}) },
      features: Array.isArray(parsed.features) ? parsed.features : defaultSiteData.features,
      howToPlay: Array.isArray(parsed.howToPlay) ? parsed.howToPlay : defaultSiteData.howToPlay,
      previews: Array.isArray(parsed.previews) ? parsed.previews : defaultSiteData.previews,
      team: Array.isArray(parsed.team) ? parsed.team : defaultSiteData.team
    };
  } catch {
    return defaultSiteData;
  }
}

export function saveSiteData(nextData) {
  ensureDirectories();
  const merged = {
    hero: { ...defaultSiteData.hero, ...(nextData.hero || {}) },
    hybrid: { ...defaultSiteData.hybrid, ...(nextData.hybrid || {}) },
    features: Array.isArray(nextData.features) ? nextData.features : [],
    howToPlay: Array.isArray(nextData.howToPlay) ? nextData.howToPlay : [],
    previews: Array.isArray(nextData.previews) ? nextData.previews : [],
    team: Array.isArray(nextData.team) ? nextData.team : [],
    footer: { ...defaultSiteData.footer, ...(nextData.footer || {}) }
  };
  atomicWriteJson(SITE_DATA_PATH, merged);
  return merged;
}

export function resetSiteData() {
  ensureDirectories();
  atomicWriteJson(SITE_DATA_PATH, defaultSiteData);
  return defaultSiteData;
}

export function getPlaytestSignups() {
  ensureDirectories();
  try {
    const raw = fs.readFileSync(SIGNUPS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addPlaytestSignup({ name, email, device }) {
  ensureDirectories();
  const signups = getPlaytestSignups();
  const entry = {
    id: `ps-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: String(name || "").trim().slice(0, 120),
    email: String(email || "").trim().slice(0, 180),
    device: String(device || "iPhone (iOS)").trim().slice(0, 80),
    createdAt: new Date().toISOString()
  };
  signups.unshift(entry);
  atomicWriteJson(SIGNUPS_PATH, signups);
  return entry;
}

export function deletePlaytestSignup(id) {
  ensureDirectories();
  const signups = getPlaytestSignups();
  const next = signups.filter((item) => item.id !== id);
  atomicWriteJson(SIGNUPS_PATH, next);
  return next;
}

