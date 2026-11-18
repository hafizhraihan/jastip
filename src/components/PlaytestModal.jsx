import React, { useState } from "react";
import { X, Smartphone, CheckCircle2, ExternalLink } from "lucide-react";

export function PlaytestModal({ isOpen, onClose, hero }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [device, setDevice] = useState("iPhone (iOS TestFlight)");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const hasDirectUrl = Boolean(hero?.ctaUrl && hero.ctaUrl.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email to join the playtest.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/playtest-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, device })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not submit playtest request.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError("");
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="playtest-modal-title">
      <div className="modal-card sketch-card-elevated">
        <button
          type="button"
          className="modal-close-btn"
          onClick={resetAndClose}
          aria-label="Close playtest modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="modal-header-row">
          {hero?.appIconUrl && (
            <img src={hero.appIconUrl} alt={hero.appName} className="modal-app-icon" />
          )}
          <div>
            <h3 id="playtest-modal-title" style={{ margin: 0, fontSize: "1.5rem" }}>
              Join the {hero?.appName || "JASTIP"} Playtest
            </h3>
          </div>
        </div>

        {hasDirectUrl && (
          <div className="playtest-direct-box">
            <p style={{ margin: "0 0 10px" }}>
              TestFlight beta access is live! Open the link below on your iPhone or iPad to install the companion app.
            </p>
            <a
              href={hero.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-chunky"
              style={{ width: "100%" }}
            >
              <Smartphone size={20} strokeWidth={2.5} />
              <span>Open iOS Playtest Link</span>
              <ExternalLink size={16} strokeWidth={2.5} />
            </a>
          </div>
        )}

        {submitted ? (
          <div className="playtest-success-box">
            <CheckCircle2 size={42} color="var(--success)" strokeWidth={2.4} />
            <h4 style={{ margin: "10px 0 6px", fontSize: "1.25rem" }}>
              Boarding Pass Reserved!
            </h4>
            <p style={{ margin: "0 0 18px", color: "var(--text-muted)" }}>
              Thanks, <strong>{name}</strong>! We've added <strong>{email}</strong> to the JASTIP Playtest crew and will send your iOS TestFlight invite + printable tabletop cards soon.
            </p>
            <button type="button" className="btn-primary-chunky" onClick={resetAndClose}>
              Back to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="playtest-form">
            <p style={{ margin: "0 0 14px", color: "var(--text-muted)", fontSize: "0.95rem" }}>
              {hasDirectUrl
                ? "Want printable tabletop cards or updates on upcoming playtest sessions? Leave your email below:"
                : "Sign up to get instant TestFlight invite access for iOS plus our print-and-play tabletop starter kit."}
            </p>

            <div className="form-field">
              <label htmlFor="pt-name">Your Name</label>
              <input
                id="pt-name"
                className="sketch-input"
                type="text"
                placeholder="e.g., Alex Tan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="pt-email">Email (Apple ID / Contact)</label>
              <input
                id="pt-email"
                className="sketch-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="pt-device">Device &amp; Playtest Setup</label>
              <select
                id="pt-device"
                className="sketch-input"
                value={device}
                onChange={(e) => setDevice(e.target.value)}
              >
                <option value="iPhone (iOS TestFlight)">iPhone (iOS TestFlight)</option>
                <option value="iPad (iPadOS TestFlight)">iPad (iPadOS TestFlight)</option>
                <option value="iOS + Print-and-Play Tabletop">iOS + Print-and-Play Tabletop</option>
              </select>
            </div>

            {error && <p className="form-error-msg">{error}</p>}

            <button
              type="submit"
              className="btn-primary-chunky"
              disabled={submitting}
              style={{ width: "100%", marginTop: 6 }}
            >
              {submitting ? "Sending Boarding Pass..." : "Request Playtest Access"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

