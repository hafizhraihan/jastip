import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DATA_DIR, ensureDirectories } from "./storage.js";

const COOKIE_NAME = "jastip_admin_session";
const SECRET_PATH = path.join(DATA_DIR, ".session-secret");

const ADMIN_USERNAME = process.env.JASTIP_ADMIN_USER || "jastip";
const ADMIN_PASSWORD = process.env.JASTIP_ADMIN_PASS || "dicetomeetyou2026";
const SALT = "jastip-boardgame-2026";
const EXPECTED_PASSWORD_HASH = crypto.scryptSync(ADMIN_PASSWORD, SALT, 64);

function getSessionSecret() {
  ensureDirectories();
  if (process.env.JASTIP_SESSION_SECRET) {
    return process.env.JASTIP_SESSION_SECRET;
  }
  if (fs.existsSync(SECRET_PATH)) {
    return fs.readFileSync(SECRET_PATH, "utf-8").trim();
  }
  const generated = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(SECRET_PATH, generated, { mode: 0o600 });
  return generated;
}

export function verifyCredentials(username, password) {
  if (typeof username !== "string" || typeof password !== "string") {
    return false;
  }
  if (username.trim() !== ADMIN_USERNAME) {
    return false;
  }
  const derived = crypto.scryptSync(password, SALT, 64);
  return crypto.timingSafeEqual(derived, EXPECTED_PASSWORD_HASH);
}

export function createSessionToken(username) {
  const secret = getSessionSecret();
  const payload = Buffer.from(
    JSON.stringify({
      sub: username,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7
    })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }
  const [payload, sig] = token.split(".");
  const secret = getSessionSecret();
  const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (!parsed.exp || Date.now() > parsed.exp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function getAuthenticatedUser(req) {
  const token = req.cookies?.[COOKIE_NAME];
  return verifySessionToken(token);
}

export function requireAdmin(req, res, next) {
  const session = getAuthenticatedUser(req);
  if (!session) {
    return res.status(401).json({ error: "Authentication required." });
  }
  req.adminUser = session;
  next();
}

