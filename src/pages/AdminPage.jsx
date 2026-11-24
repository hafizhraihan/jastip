import React, { useState, useEffect } from "react";
import {
  Lock,
  LogOut,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Eye,
  Sun,
  Moon,
  RotateCcw,
  Users,
  Sparkles,
  Smartphone,
  ListOrdered,
  LayoutTemplate,
  Compass,
  MailCheck
} from "lucide-react";

function ImageUploadField({ label, value, onChange, presets = [] }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange(json.url);
    } catch (error) {
      setErr(error.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="form-field">
      <label>{label}</label>
      <div className="upload-field-row">
        <div className="upload-thumb-box">
          {value ? (
            <img src={value} alt={label} />
          ) : (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>None</span>
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <label className="btn-secondary-chunky" style={{ padding: "8px 12px", fontSize: "0.85rem" }}>
              <Upload size={15} />
              <span>{uploading ? "Uploading..." : "Upload Image"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={handleFile}
                style={{ display: "none" }}
                disabled={uploading}
              />
            </label>
            {value && (
              <button
                type="button"
                className="btn-secondary-chunky"
                style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                onClick={() => onChange("")}
              >
                Clear
              </button>
            )}
          </div>
          <input
            type="text"
            className="sketch-input"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL (e.g. /assets/... or https://...)"
          />
          {presets.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <small style={{ color: "var(--text-muted)" }}>Presets:</small>
              {presets.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  className="preset-mini-btn"
                  onClick={() => onChange(p.url)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          {err && <small className="form-error-msg">{err}</small>}
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: "hero", label: "Hero & Playtest", icon: Sparkles },
  { id: "hybrid", label: "Tabletop + iOS", icon: LayoutTemplate },
  { id: "features", label: "Features", icon: LayoutTemplate },
  { id: "howToPlay", label: "How to Play", icon: ListOrdered },
  { id: "previews", label: "App Previews", icon: Smartphone },
  { id: "team", label: "Team", icon: Users },
  { id: "footer", label: "Footer & Contact", icon: Compass },
  { id: "signups", label: "Playtest Signups", icon: MailCheck }
];

export function AdminPage({ data, onDataSaved, theme, onToggleTheme, onNavigate }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState("hero");
  const [draft, setDraft] = useState(() => structuredClone(data));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [signups, setSignups] = useState([]);

  useEffect(() => {
    setDraft(structuredClone(data));
  }, [data]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((res) => {
        if (!mounted) return;
        setAuthenticated(Boolean(res.authenticated));
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setAuthLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetch("/api/playtest-signups")
        .then((r) => (r.ok ? r.json() : []))
        .then((list) => setSignups(Array.isArray(list) ? list : []))
        .catch(() => {});
    }
  }, [authenticated]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Invalid credentials.");
      }
      setAuthenticated(true);
      setPassword("");
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
  };

  const updateDraft = (updater) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      updater(next);
      return next;
    });
    setDirty(true);
  };

  const saveAll = async (customDraft = draft) => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customDraft)
      });
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const saved = await res.json();
      if (!res.ok) throw new Error(saved.error || "Failed to save.");
      onDataSaved(saved);
      setDraft(structuredClone(saved));
      setDirty(false);
      showToast("All changes saved to live site!");
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset all website copy and items back to the starter template?")) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/content/reset", { method: "POST" });
      if (!res.ok) throw new Error("Failed to reset");
      const resetData = await res.json();
      onDataSaved(resetData);
      setDraft(structuredClone(resetData));
      setDirty(false);
      showToast("Content reset to defaults.");
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const moveItem = (arr, index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    const [item] = arr.splice(index, 1);
    arr.splice(target, 0, item);
  };

  const deleteSignup = async (id) => {
    const res = await fetch(`/api/playtest-signups/${id}`, { method: "DELETE" });
    if (res.ok) {
      const next = await res.json();
      setSignups(next);
      showToast("Signup removed.");
    }
  };

  if (authLoading) {
    return (
      <div className="paper-canvas admin-auth-page">
        <div className="sketch-card-elevated admin-auth-card">
          <p className="font-display">Checking boarding pass...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="paper-canvas admin-auth-page">
        <div className="admin-auth-topbar container">
          <button
            type="button"
            className="btn-secondary-chunky"
            onClick={() => onNavigate("/")}
          >
            <Eye size={16} />
            <span>Back to Website</span>
          </button>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <div className="sketch-card-elevated admin-auth-card">
          <div className="admin-auth-header">
            <img src={data.hero.appIconUrl} alt="JASTIP" className="nav-app-icon" />
            <div>
              <span className="stamp-badge" style={{ marginBottom: 4 }}>
                <Lock size={13} />
                Staff Only
              </span>
              <h1 style={{ margin: 0, fontSize: "1.75rem" }}>JASTIP Admin</h1>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", marginTop: 8, marginBottom: 20 }}>
            Sign in to add, edit, or remove hero text, game features, how-to-play steps, app screenshots, team profiles, and footer links.
          </p>

          {typeof window !== "undefined" &&
            window.location.hostname !== "localhost" &&
            window.location.hostname !== "127.0.0.1" && (
              <div
                className="sketch-card"
                style={{
                  padding: "12px 14px",
                  marginBottom: "18px",
                  backgroundColor: "var(--surface)",
                  fontSize: "0.85rem",
                  lineHeight: 1.45
                }}
              >
                <strong>💡 Info Mode Deploy (Netlify)</strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)" }}>
                  Admin CMS beroperasi di komputer lokal. Untuk mengubah konten dan upload foto, jalankan di terminal lokal: <code>npm run dev</code> lalu push perubahan via git.
                </p>
              </div>
            )}

          <form onSubmit={handleLogin}>
            <div className="form-field">
              <label htmlFor="admin-user">Username</label>
              <input
                id="admin-user"
                className="sketch-input"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="admin-pass">Password</label>
              <input
                id="admin-pass"
                className="sketch-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {loginError && <p className="form-error-msg">{loginError}</p>}

            <button
              type="submit"
              className="btn-primary-chunky"
              disabled={loggingIn}
              style={{ width: "100%", marginTop: 8 }}
            >
              {loggingIn ? "Unlocking..." : "Unlock Admin CMS"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-canvas admin-shell">
      {/* Admin Topbar */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand-lockup">
            <img src={draft.hero.appIconUrl || "/assets/jastip-icon.svg"} alt="JASTIP" className="nav-app-icon" />
            <div>
              <span className="font-display brand-name" style={{ fontSize: "1.15rem" }}>
                JASTIP CMS
              </span>
              <span className={`admin-save-status ${dirty ? "is-dirty" : ""}`}>
                {dirty ? "Unsaved edits" : "All saved"}
              </span>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <button
              type="button"
              className="btn-secondary-chunky"
              onClick={() => onNavigate("/")}
            >
              <Eye size={16} />
              <span className="hide-sm">View Site</span>
            </button>

            <button
              type="button"
              className="btn-primary-chunky"
              disabled={saving}
              onClick={() => saveAll(draft)}
              style={{ padding: "9px 18px", fontSize: "0.95rem" }}
            >
              <Save size={17} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>

            <button
              type="button"
              className="btn-secondary-chunky"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="admin-toast sketch-pill sketch-pill-accent" role="status">
          {toast}
        </div>
      )}

      <div className="container admin-layout">
        {/* Sidebar Tabs */}
        <aside className="admin-sidebar">
          <div className="sketch-card admin-nav-card">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`admin-tab-btn ${active ? "is-active" : ""}`}
                >
                  <Icon size={17} strokeWidth={2.4} />
                  <span>{tab.label}</span>
                  {tab.id === "signups" && signups.length > 0 && (
                    <span className="admin-count-badge">{signups.length}</span>
                  )}
                </button>
              );
            })}

            <hr className="ticket-divider" style={{ margin: "12px 0" }} />

            <button
              type="button"
              className="admin-tab-btn"
              onClick={handleReset}
              style={{ color: "var(--accent)" }}
            >
              <RotateCcw size={16} />
              <span>Reset Defaults</span>
            </button>
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="admin-main">
          {activeTab === "hero" && (
            <section className="sketch-card-elevated admin-panel">
              <div className="admin-panel-head">
                <h2>Hero Section &amp; Playtest CTA</h2>
                <p>Edit your app icon, game title, tagline, playtest badge, and TestFlight CTA link.</p>
              </div>

              <ImageUploadField
                label="App Icon"
                value={draft.hero.appIconUrl}
                onChange={(val) => updateDraft((d) => { d.hero.appIconUrl = val; })}
                presets={[{ label: "Default Suitcase Icon", url: "/assets/jastip-icon.svg" }]}
              />

              <div className="admin-two-col">
                <div className="form-field">
                  <label>App Name</label>
                  <input
                    className="sketch-input"
                    value={draft.hero.appName}
                    onChange={(e) => updateDraft((d) => { d.hero.appName = e.target.value; })}
                  />
                </div>
                <div className="form-field">
                  <label>Availability Badge</label>
                  <input
                    className="sketch-input"
                    value={draft.hero.availabilityBadge}
                    onChange={(e) => updateDraft((d) => { d.hero.availabilityBadge = e.target.value; })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Tagline</label>
                <input
                  className="sketch-input"
                  value={draft.hero.tagline}
                  onChange={(e) => updateDraft((d) => { d.hero.tagline = e.target.value; })}
                />
              </div>

              <div className="form-field">
                <label>App Description</label>
                <textarea
                  className="sketch-input"
                  rows={3}
                  value={draft.hero.description}
                  onChange={(e) => updateDraft((d) => { d.hero.description = e.target.value; })}
                />
              </div>

              <div className="admin-two-col">
                <div className="form-field">
                  <label>Primary CTA Label</label>
                  <input
                    className="sketch-input"
                    value={draft.hero.ctaText}
                    onChange={(e) => updateDraft((d) => { d.hero.ctaText = e.target.value; })}
                  />
                </div>
                <div className="form-field">
                  <label>TestFlight / Playtest URL (optional)</label>
                  <input
                    className="sketch-input"
                    placeholder="https://testflight.apple.com/join/..."
                    value={draft.hero.ctaUrl || ""}
                    onChange={(e) => updateDraft((d) => { d.hero.ctaUrl = e.target.value; })}
                  />
                </div>
              </div>
            </section>
          )}

          {activeTab === "hybrid" && (
            <section className="sketch-card-elevated admin-panel">
              <div className="admin-panel-head">
                <h2>Combining Tabletop Game &amp; iOS Experience</h2>
                <p>Customize the bridge section explaining how the physical tabletop pairs with the iPhone app.</p>
              </div>

              <div className="admin-two-col">
                <div className="form-field">
                  <label>Eyebrow Badge</label>
                  <input
                    className="sketch-input"
                    value={draft.hybrid.eyebrow}
                    onChange={(e) => updateDraft((d) => { d.hybrid.eyebrow = e.target.value; })}
                  />
                </div>
                <div className="form-field">
                  <label>Section Title</label>
                  <input
                    className="sketch-input"
                    value={draft.hybrid.title}
                    onChange={(e) => updateDraft((d) => { d.hybrid.title = e.target.value; })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Section Lead Description</label>
                <textarea
                  className="sketch-input"
                  rows={2}
                  value={draft.hybrid.description}
                  onChange={(e) => updateDraft((d) => { d.hybrid.description = e.target.value; })}
                />
              </div>

              <div className="admin-two-col">
                <div className="sketch-card" style={{ padding: 16 }}>
                  <div className="form-field">
                    <label>Tabletop Card Title</label>
                    <input
                      className="sketch-input"
                      value={draft.hybrid.tabletopTitle}
                      onChange={(e) => updateDraft((d) => { d.hybrid.tabletopTitle = e.target.value; })}
                    />
                  </div>
                  <label className="small-label">Tabletop Bullet Points</label>
                  {(draft.hybrid.tabletopPoints || []).map((pt, idx) => (
                    <div key={idx} className="inline-edit-row">
                      <input
                        className="sketch-input"
                        value={pt}
                        onChange={(e) => updateDraft((d) => { d.hybrid.tabletopPoints[idx] = e.target.value; })}
                      />
                      <button
                        type="button"
                        className="btn-danger-chunky"
                        onClick={() => updateDraft((d) => { d.hybrid.tabletopPoints.splice(idx, 1); })}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-secondary-chunky"
                    onClick={() => updateDraft((d) => { d.hybrid.tabletopPoints.push("New tabletop highlight"); })}
                  >
                    <Plus size={15} /> Add Point
                  </button>
                </div>

                <div className="sketch-card" style={{ padding: 16 }}>
                  <div className="form-field">
                    <label>iOS Card Title</label>
                    <input
                      className="sketch-input"
                      value={draft.hybrid.iosTitle}
                      onChange={(e) => updateDraft((d) => { d.hybrid.iosTitle = e.target.value; })}
                    />
                  </div>
                  <label className="small-label">iOS Bullet Points</label>
                  {(draft.hybrid.iosPoints || []).map((pt, idx) => (
                    <div key={idx} className="inline-edit-row">
                      <input
                        className="sketch-input"
                        value={pt}
                        onChange={(e) => updateDraft((d) => { d.hybrid.iosPoints[idx] = e.target.value; })}
                      />
                      <button
                        type="button"
                        className="btn-danger-chunky"
                        onClick={() => updateDraft((d) => { d.hybrid.iosPoints.splice(idx, 1); })}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-secondary-chunky"
                    onClick={() => updateDraft((d) => { d.hybrid.iosPoints.push("New iOS highlight"); })}
                  >
                    <Plus size={15} /> Add Point
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "features" && (
            <section className="sketch-card-elevated admin-panel">
              <div className="admin-panel-head-row">
                <div>
                  <h2>Game Features</h2>
                  <p>Add, edit, reorder, or remove feature cards (Packing Grid, Multiplayer, Jastip Orders, etc.).</p>
                </div>
                <button
                  type="button"
                  className="btn-primary-chunky"
                  onClick={() =>
                    updateDraft((d) => {
                      d.features.push({
                        id: `feat-${Date.now()}`,
                        title: "New Feature",
                        badge: "New",
                        description: "Describe how this feature elevates JASTIP.",
                        visualType: "custom",
                        imageUrl: ""
                      });
                    })
                  }
                >
                  <Plus size={17} /> Add Feature
                </button>
              </div>

              <div className="admin-item-stack">
                {draft.features.map((feat, idx) => (
                  <div key={feat.id} className="sketch-card admin-item-card">
                    <div className="admin-item-bar">
                      <strong className="font-display">#{idx + 1} — {feat.title || "Untitled Feature"}</strong>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          className="btn-secondary-chunky icon-btn"
                          disabled={idx === 0}
                          onClick={() => updateDraft((d) => moveItem(d.features, idx, -1))}
                          title="Move up"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-secondary-chunky icon-btn"
                          disabled={idx === draft.features.length - 1}
                          onClick={() => updateDraft((d) => moveItem(d.features, idx, 1))}
                          title="Move down"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-danger-chunky icon-btn"
                          onClick={() => updateDraft((d) => { d.features.splice(idx, 1); })}
                          title="Remove feature"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="admin-three-col">
                      <div className="form-field">
                        <label>Title</label>
                        <input
                          className="sketch-input"
                          value={feat.title}
                          onChange={(e) => updateDraft((d) => { d.features[idx].title = e.target.value; })}
                        />
                      </div>
                      <div className="form-field">
                        <label>Badge</label>
                        <input
                          className="sketch-input"
                          value={feat.badge || ""}
                          onChange={(e) => updateDraft((d) => { d.features[idx].badge = e.target.value; })}
                        />
                      </div>
                      <div className="form-field">
                        <label>Hand-Drawn Visual Preset</label>
                        <select
                          className="sketch-input"
                          value={feat.visualType || "custom"}
                          onChange={(e) => updateDraft((d) => { d.features[idx].visualType = e.target.value; })}
                        >
                          <option value="packing-grid">Packing Grid Illustration</option>
                          <option value="multiplayer">Multiplayer Table Illustration</option>
                          <option value="jastip-orders">Jastip Orders Tickets</option>
                          <option value="custom">Star Ticket Badge</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Description</label>
                      <textarea
                        className="sketch-input"
                        rows={2}
                        value={feat.description}
                        onChange={(e) => updateDraft((d) => { d.features[idx].description = e.target.value; })}
                      />
                    </div>

                    <ImageUploadField
                      label="Custom Illustration / Image (optional, overrides preset)"
                      value={feat.imageUrl || ""}
                      onChange={(val) => updateDraft((d) => { d.features[idx].imageUrl = val; })}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "howToPlay" && (
            <section className="sketch-card-elevated admin-panel">
              <div className="admin-panel-head-row">
                <div>
                  <h2>How to Play Steps</h2>
                  <p>Manage each turn phase or setup step shown on the landing page.</p>
                </div>
                <button
                  type="button"
                  className="btn-primary-chunky"
                  onClick={() =>
                    updateDraft((d) => {
                      d.howToPlay.push({
                        id: `step-${Date.now()}`,
                        stepNumber: d.howToPlay.length + 1,
                        title: "New Step",
                        description: "Describe what players do in this step.",
                        mode: "Tabletop + iOS"
                      });
                    })
                  }
                >
                  <Plus size={17} /> Add Step
                </button>
              </div>

              <div className="admin-item-stack">
                {draft.howToPlay.map((step, idx) => (
                  <div key={step.id} className="sketch-card admin-item-card">
                    <div className="admin-item-bar">
                      <strong className="font-display">Step {step.stepNumber || idx + 1}: {step.title}</strong>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          className="btn-secondary-chunky icon-btn"
                          disabled={idx === 0}
                          onClick={() => updateDraft((d) => moveItem(d.howToPlay, idx, -1))}
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-secondary-chunky icon-btn"
                          disabled={idx === draft.howToPlay.length - 1}
                          onClick={() => updateDraft((d) => moveItem(d.howToPlay, idx, 1))}
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-danger-chunky icon-btn"
                          onClick={() => updateDraft((d) => { d.howToPlay.splice(idx, 1); })}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="admin-three-col">
                      <div className="form-field">
                        <label>Step Number</label>
                        <input
                          type="number"
                          className="sketch-input"
                          value={step.stepNumber}
                          onChange={(e) =>
                            updateDraft((d) => { d.howToPlay[idx].stepNumber = Number(e.target.value) || idx + 1; })
                          }
                        />
                      </div>
                      <div className="form-field">
                        <label>Title</label>
                        <input
                          className="sketch-input"
                          value={step.title}
                          onChange={(e) => updateDraft((d) => { d.howToPlay[idx].title = e.target.value; })}
                        />
                      </div>
                      <div className="form-field">
                        <label>Mode Pill</label>
                        <input
                          className="sketch-input"
                          value={step.mode || ""}
                          placeholder="Tabletop / iOS App / Both"
                          onChange={(e) => updateDraft((d) => { d.howToPlay[idx].mode = e.target.value; })}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Description</label>
                      <textarea
                        className="sketch-input"
                        rows={2}
                        value={step.description}
                        onChange={(e) => updateDraft((d) => { d.howToPlay[idx].description = e.target.value; })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "previews" && (
            <section className="sketch-card-elevated admin-panel">
              <div className="admin-panel-head-row">
                <div>
                  <h2>App Previews &amp; Screenshots</h2>
                  <p>Upload real iOS app screenshots or use the built-in interactive companion presets.</p>
                </div>
                <button
                  type="button"
                  className="btn-primary-chunky"
                  onClick={() =>
                    updateDraft((d) => {
                      d.previews.push({
                        id: `prev-${Date.now()}`,
                        title: "New App Screen",
                        subtitle: "Short screen subtitle",
                        caption: "Explain what players see on this screen.",
                        screenPreset: "packing",
                        imageUrl: ""
                      });
                    })
                  }
                >
                  <Plus size={17} /> Add Preview
                </button>
              </div>

              <div className="admin-item-stack">
                {draft.previews.map((prev, idx) => (
                  <div key={prev.id} className="sketch-card admin-item-card">
                    <div className="admin-item-bar">
                      <strong className="font-display">#{idx + 1} — {prev.title}</strong>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          className="btn-secondary-chunky icon-btn"
                          disabled={idx === 0}
                          onClick={() => updateDraft((d) => moveItem(d.previews, idx, -1))}
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-secondary-chunky icon-btn"
                          disabled={idx === draft.previews.length - 1}
                          onClick={() => updateDraft((d) => moveItem(d.previews, idx, 1))}
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-danger-chunky icon-btn"
                          onClick={() => updateDraft((d) => { d.previews.splice(idx, 1); })}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="admin-three-col">
                      <div className="form-field">
                        <label>Screen Title</label>
                        <input
                          className="sketch-input"
                          value={prev.title}
                          onChange={(e) => updateDraft((d) => { d.previews[idx].title = e.target.value; })}
                        />
                      </div>
                      <div className="form-field">
                        <label>Subtitle</label>
                        <input
                          className="sketch-input"
                          value={prev.subtitle}
                          onChange={(e) => updateDraft((d) => { d.previews[idx].subtitle = e.target.value; })}
                        />
                      </div>
                      <div className="form-field">
                        <label>Interactive Preset (if no screenshot uploaded)</label>
                        <select
                          className="sketch-input"
                          value={prev.screenPreset || "packing"}
                          onChange={(e) => updateDraft((d) => { d.previews[idx].screenPreset = e.target.value; })}
                        >
                          <option value="packing">Interactive Packing Grid</option>
                          <option value="orders">Jastip Orders Feed</option>
                          <option value="multiplayer">Multiplayer Sync Board</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Caption</label>
                      <textarea
                        className="sketch-input"
                        rows={2}
                        value={prev.caption}
                        onChange={(e) => updateDraft((d) => { d.previews[idx].caption = e.target.value; })}
                      />
                    </div>

                    <ImageUploadField
                      label="iOS Screenshot Upload (optional)"
                      value={prev.imageUrl || ""}
                      onChange={(val) => updateDraft((d) => { d.previews[idx].imageUrl = val; })}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "team" && (
            <section className="sketch-card-elevated admin-panel">
              <div className="admin-panel-head-row">
                <div>
                  <h2>People Behind the Game</h2>
                  <p>Add, edit, reorder, or remove team members (picture, name, role, LinkedIn).</p>
                </div>
                <button
                  type="button"
                  className="btn-primary-chunky"
                  onClick={() =>
                    updateDraft((d) => {
                      d.team.push({
                        id: `team-${Date.now()}`,
                        name: "New Team Member",
                        role: "Role / Discipline",
                        avatarUrl: "/assets/team-1.svg",
                        linkedinUrl: "https://www.linkedin.com"
                      });
                    })
                  }
                >
                  <Plus size={17} /> Add Person
                </button>
              </div>

              <div className="admin-item-stack">
                {draft.team.map((member, idx) => (
                  <div key={member.id} className="sketch-card admin-item-card">
                    <div className="admin-item-bar">
                      <strong className="font-display">#{idx + 1} — {member.name}</strong>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          className="btn-secondary-chunky icon-btn"
                          disabled={idx === 0}
                          onClick={() => updateDraft((d) => moveItem(d.team, idx, -1))}
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-secondary-chunky icon-btn"
                          disabled={idx === draft.team.length - 1}
                          onClick={() => updateDraft((d) => moveItem(d.team, idx, 1))}
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-danger-chunky icon-btn"
                          onClick={() => updateDraft((d) => { d.team.splice(idx, 1); })}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="admin-three-col">
                      <div className="form-field">
                        <label>Name</label>
                        <input
                          className="sketch-input"
                          value={member.name}
                          onChange={(e) => updateDraft((d) => { d.team[idx].name = e.target.value; })}
                        />
                      </div>
                      <div className="form-field">
                        <label>Role</label>
                        <input
                          className="sketch-input"
                          value={member.role}
                          onChange={(e) => updateDraft((d) => { d.team[idx].role = e.target.value; })}
                        />
                      </div>
                      <div className="form-field">
                        <label>LinkedIn URL</label>
                        <input
                          className="sketch-input"
                          value={member.linkedinUrl || ""}
                          placeholder="https://www.linkedin.com/in/..."
                          onChange={(e) => updateDraft((d) => { d.team[idx].linkedinUrl = e.target.value; })}
                        />
                      </div>
                    </div>

                    <ImageUploadField
                      label="Profile Picture"
                      value={member.avatarUrl || ""}
                      onChange={(val) => updateDraft((d) => { d.team[idx].avatarUrl = val; })}
                      presets={[
                        { label: "Avatar 1", url: "/assets/team-1.svg" },
                        { label: "Avatar 2", url: "/assets/team-2.svg" },
                        { label: "Avatar 3", url: "/assets/team-3.svg" },
                        { label: "Avatar 4", url: "/assets/team-4.svg" }
                      ]}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "footer" && (
            <section className="sketch-card-elevated admin-panel">
              <div className="admin-panel-head">
                <h2>Footer, Explore List &amp; Contact</h2>
                <p>Update footer summary, navigation links, contact email, social links, and copyright text.</p>
              </div>

              <div className="form-field">
                <label>Footer App Description</label>
                <textarea
                  className="sketch-input"
                  rows={2}
                  value={draft.footer.description}
                  onChange={(e) => updateDraft((d) => { d.footer.description = e.target.value; })}
                />
              </div>

              <div className="admin-two-col">
                <div className="form-field">
                  <label>Contact Email</label>
                  <input
                    className="sketch-input"
                    value={draft.footer.contactEmail || ""}
                    onChange={(e) => updateDraft((d) => { d.footer.contactEmail = e.target.value; })}
                  />
                </div>
                <div className="form-field">
                  <label>Copyright Notice</label>
                  <input
                    className="sketch-input"
                    value={draft.footer.copyright}
                    onChange={(e) => updateDraft((d) => { d.footer.copyright = e.target.value; })}
                  />
                </div>
              </div>

              <div className="admin-two-col" style={{ marginTop: 12 }}>
                <div className="sketch-card" style={{ padding: 16 }}>
                  <div className="admin-item-bar" style={{ marginBottom: 10 }}>
                    <strong className="font-display">Explore List</strong>
                    <button
                      type="button"
                      className="btn-secondary-chunky"
                      style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      onClick={() =>
                        updateDraft((d) => {
                          d.footer.exploreLinks.push({
                            id: `exp-${Date.now()}`,
                            label: "New Link",
                            href: "#top"
                          });
                        })
                      }
                    >
                      <Plus size={14} /> Add Link
                    </button>
                  </div>
                  {(draft.footer.exploreLinks || []).map((lnk, idx) => (
                    <div key={lnk.id} className="inline-edit-row">
                      <input
                        className="sketch-input"
                        placeholder="Label"
                        value={lnk.label}
                        onChange={(e) => updateDraft((d) => { d.footer.exploreLinks[idx].label = e.target.value; })}
                      />
                      <input
                        className="sketch-input"
                        placeholder="#section or /path"
                        value={lnk.href}
                        onChange={(e) => updateDraft((d) => { d.footer.exploreLinks[idx].href = e.target.value; })}
                      />
                      <button
                        type="button"
                        className="btn-danger-chunky"
                        onClick={() => updateDraft((d) => { d.footer.exploreLinks.splice(idx, 1); })}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="sketch-card" style={{ padding: 16 }}>
                  <div className="admin-item-bar" style={{ marginBottom: 10 }}>
                    <strong className="font-display">Contact / Social Links</strong>
                    <button
                      type="button"
                      className="btn-secondary-chunky"
                      style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      onClick={() =>
                        updateDraft((d) => {
                          d.footer.socialLinks.push({
                            id: `soc-${Date.now()}`,
                            label: "New Channel",
                            url: "https://"
                          });
                        })
                      }
                    >
                      <Plus size={14} /> Add Social
                    </button>
                  </div>
                  {(draft.footer.socialLinks || []).map((soc, idx) => (
                    <div key={soc.id} className="inline-edit-row">
                      <input
                        className="sketch-input"
                        placeholder="Label"
                        value={soc.label}
                        onChange={(e) => updateDraft((d) => { d.footer.socialLinks[idx].label = e.target.value; })}
                      />
                      <input
                        className="sketch-input"
                        placeholder="URL"
                        value={soc.url}
                        onChange={(e) => updateDraft((d) => { d.footer.socialLinks[idx].url = e.target.value; })}
                      />
                      <button
                        type="button"
                        className="btn-danger-chunky"
                        onClick={() => updateDraft((d) => { d.footer.socialLinks.splice(idx, 1); })}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === "signups" && (
            <section className="sketch-card-elevated admin-panel">
              <div className="admin-panel-head">
                <h2>Playtest Signups</h2>
                <p>Visitors who clicked “Playtest Now” and requested TestFlight / print-and-play access.</p>
              </div>

              {signups.length === 0 ? (
                <div className="sketch-card" style={{ padding: 24, textAlign: "center" }}>
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>
                    No playtest signups yet. When someone requests access from the Playtest modal, they’ll show up here!
                  </p>
                </div>
              ) : (
                <div className="admin-item-stack">
                  {signups.map((item) => (
                    <div key={item.id} className="sketch-card admin-signup-row">
                      <div>
                        <strong className="font-display">{item.name}</strong>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                          {item.email} • {item.device}
                        </div>
                        <small style={{ color: "var(--text-muted)" }}>
                          {new Date(item.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn-danger-chunky"
                        onClick={() => deleteSignup(item.id)}
                      >
                        <Trash2 size={15} />
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

