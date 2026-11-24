import React, { useState } from "react";
import {
  Sun,
  Moon,
  Smartphone,
  Compass,
  Linkedin,
  Mail,
  ArrowUpRight,
  Menu,
  X,
  Users,
  Swords
} from "lucide-react";
import {
  SquiggleUnderline,
  HandDrawnConnector,
  FeatureArtwork,
  PhonePreviewScreen
} from "../components/HandDrawnArt.jsx";
import { PlaytestModal } from "../components/PlaytestModal.jsx";

export function LandingPage({ data, theme, onToggleTheme, onNavigate }) {
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);
  const [playtestOpen, setPlaytestOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { hero, hybrid, features, howToPlay, previews, team, footer } = data;
  const safePreviewIdx = Math.min(activePreviewIdx, Math.max(0, previews.length - 1));
  const currentPreview = previews[safePreviewIdx] || previews[0];

  const handleLinkClick = (e, href) => {
    setMobileMenuOpen(false);
    if (href === "/admin") {
      e.preventDefault();
      onNavigate("/admin");
    } else if (href === "#playtest") {
      e.preventDefault();
      setPlaytestOpen(true);
    }
  };

  return (
    <div className="paper-canvas min-h-screen">
      {/* Top Navbar */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" className="brand-lockup">
            <img src={hero.appIconUrl} alt={`${hero.appName} icon`} className="nav-app-icon" />
            <span className="font-display brand-name">{hero.appName}</span>
          </a>

          <nav className="desktop-nav" aria-label="Main Navigation">
            <a href="#hybrid">Tabletop + iOS</a>
            <a href="#features">Features</a>
            <a href="#how-to-play">How to Play</a>
            <a href="#preview">Preview</a>
            <a href="#team">Team</a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={18} strokeWidth={2.5} /> : <Sun size={18} strokeWidth={2.5} />}
              <span className="theme-toggle-label">
                {theme === "light" ? "Dark" : "Light"}
              </span>
            </button>

            <button
              type="button"
              className="btn-primary-chunky nav-cta-btn"
              onClick={() => setPlaytestOpen(true)}
            >
              {hero.ctaText || "Playtest Now"}
            </button>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav-drawer container">
            <a href="#hybrid" onClick={() => setMobileMenuOpen(false)}>Tabletop + iOS</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-to-play" onClick={() => setMobileMenuOpen(false)}>How to Play</a>
            <a href="#preview" onClick={() => setMobileMenuOpen(false)}>App Preview</a>
            <a href="#team" onClick={() => setMobileMenuOpen(false)}>People Behind the Game</a>
            <button
              type="button"
              className="btn-primary-chunky"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => {
                setMobileMenuOpen(false);
                setPlaytestOpen(true);
              }}
            >
              {hero.ctaText || "Playtest Now"}
            </button>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-identity-row">
                <img
                  src={hero.appIconUrl}
                  alt={`${hero.appName} app icon`}
                  className="hero-app-icon"
                />
                <div>
                  <h1 className="hero-title">{hero.appName}</h1>
                  {hero.tagline && (
                    <p className="hero-tagline font-display">{hero.tagline}</p>
                  )}
                </div>
              </div>

              <p className="hero-description">{hero.description}</p>

              <div className="hero-game-specs">
                <span className="game-spec-pill">
                  <Users size={16} strokeWidth={2.4} />
                  <span>2-5 Players</span>
                </span>
                <span className="game-spec-pill">
                  <Swords size={16} strokeWidth={2.4} />
                  <span>Competitive</span>
                </span>
              </div>

              <div className="hero-cta-row">
                <button
                  type="button"
                  className="btn-primary-chunky hero-cta-btn"
                  onClick={() => setPlaytestOpen(true)}
                >
                  <Smartphone size={20} strokeWidth={2.5} />
                  <span>{hero.ctaText || "Playtest Now"}</span>
                </button>
                <a href="#how-to-play" className="btn-secondary-chunky hero-cta-btn">
                  How to Play
                </a>
              </div>

              <div className="hero-testflight-wrap">
                <a
                  href={hero.ctaUrl || "#playtest"}
                  onClick={(e) => {
                    if (!hero.ctaUrl) {
                      e.preventDefault();
                      setPlaytestOpen(true);
                    }
                  }}
                  className="testflight-badge-link"
                  aria-label="Available on TestFlight"
                >
                  <img
                    src="/assets/available-on-testflight.png"
                    alt="Available on TestFlight"
                    className="testflight-badge-img"
                  />
                </a>
              </div>
            </div>

            <div className="hero-visual-col">
              <div className="hero-main-media">
                <img
                  src={hero.mainImageUrl || "/assets/main.png"}
                  alt="JASTIP Store Boards, packed Suitcase, Carry-on luggage, and Random Event cards"
                  className="hero-main-img"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          <hr className="ticket-divider" />
        </div>

        {/* COMBINING TABLETOP GAME & iOS EXPERIENCE */}
        <section id="hybrid" className="section-pad">
          <div className="container">
            <div className="section-heading-block">
              <h2>{hybrid.title}</h2>
              <SquiggleUnderline width={210} />
              {hybrid.description && (
                <p className="section-lead">{hybrid.description}</p>
              )}
            </div>

            <div className="hybrid-grid">
              <div className="sketch-card-elevated hybrid-panel">
                <div className="hybrid-panel-header">
                  <div className="hybrid-icon-badge is-tabletop">
                    <Compass size={26} strokeWidth={2.4} />
                  </div>
                  <div>
                    <span className="hybrid-kicker font-display">Physical Board &amp; Cards</span>
                    <h3 style={{ margin: 0 }}>{hybrid.tabletopTitle}</h3>
                  </div>
                </div>
                <ul className="hybrid-list">
                  {(hybrid.tabletopPoints || []).map((pt, idx) => (
                    <li key={idx}>
                      <span className="bullet-stamp">{idx + 1}</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hybrid-connector-col">
                <HandDrawnConnector />
              </div>

              <div className="sketch-card-elevated hybrid-panel">
                <div className="hybrid-panel-header">
                  <div className="hybrid-icon-badge is-ios">
                    <Smartphone size={26} strokeWidth={2.4} />
                  </div>
                  <div>
                    <span className="hybrid-kicker font-display">iOS Companion App</span>
                    <h3 style={{ margin: 0 }}>{hybrid.iosTitle}</h3>
                  </div>
                </div>
                <ul className="hybrid-list">
                  {(hybrid.iosPoints || []).map((pt, idx) => (
                    <li key={idx}>
                      <span className="bullet-stamp is-yellow">{idx + 1}</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* GAME FEATURES */}
        <section id="features" className="section-pad section-tinted">
          <div className="container">
            <div className="section-heading-block">
              <h2>Game Features</h2>
              <SquiggleUnderline width={170} />
              <p className="section-lead">
                Built for 2-5 players: Suitcase and Carry-on grid packing, five Store Boards, Jastip Orders, and Random Events.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feat) => (
                <article key={feat.id} className="sketch-card-elevated sketch-card-interactive feature-card">
                  <FeatureArtwork
                    visualType={feat.visualType}
                    imageUrl={feat.imageUrl}
                    title={feat.title}
                  />
                  <div className="feature-body">
                    {feat.badge && (
                      <span className="feature-badge font-display">{feat.badge}</span>
                    )}
                    <h3>{feat.title}</h3>
                    <p>{feat.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO PLAY */}
        <section id="how-to-play" className="section-pad">
          <div className="container">
            <div className="section-heading-block">
              <h2>How to Play</h2>
              <SquiggleUnderline width={150} />
              <p className="section-lead">
                Pair the five Store Boards with the JASTIP iOS app and race the boarding countdown.
              </p>
            </div>

            <div className="steps-grid">
              {howToPlay.map((step, index) => (
                <div key={step.id} className="sketch-card step-card">
                  <div className="step-top-row">
                    <span className="step-number-badge font-display">
                      {String(step.stepNumber || index + 1).padStart(2, "0")}
                    </span>
                    {step.mode && (
                      <span className="step-mode-pill font-display">{step.mode}</span>
                    )}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APP PREVIEW / SCREENSHOTS */}
        <section id="preview" className="section-pad section-tinted">
          <div className="container">
            <div className="section-heading-block">
              <h2>App Preview</h2>
              <SquiggleUnderline width={160} />
              <p className="section-lead">
                Explore the companion screens powering every tabletop turn—try tapping between screens below.
              </p>
            </div>

            {previews.length > 0 && currentPreview && (
              <div className="preview-showcase sketch-card-elevated">
                <div className="preview-tabs-col">
                  <div className="preview-tab-list">
                    {previews.map((item, idx) => {
                      const active = idx === safePreviewIdx;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActivePreviewIdx(idx)}
                          className={`preview-tab-btn ${active ? "is-active" : ""}`}
                        >
                          <span className="preview-tab-index font-display">
                            0{idx + 1}
                          </span>
                          <div className="preview-tab-text">
                            <strong className="font-display">{item.title}</strong>
                            <span>{item.subtitle}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="preview-active-caption">
                    <h3 style={{ margin: "0 0 6px" }}>{currentPreview.title}</h3>
                    <p style={{ margin: 0, color: "var(--text-muted)" }}>
                      {currentPreview.caption}
                    </p>
                  </div>
                </div>

                <div className="preview-stage-col">
                  <PhonePreviewScreen preview={currentPreview} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PEOPLE BEHIND THE GAME */}
        <section id="team" className="section-pad">
          <div className="container">
            <div className="section-heading-block">
              <h2>People Behind the Game</h2>
              <SquiggleUnderline width={230} />
              <p className="section-lead">
                The tabletop tinkerers, artists, and iOS builders turning chaotic airport suitcase runs into your next favorite game night.
              </p>
            </div>

            <div className="team-grid">
              {team.map((member) => (
                <article key={member.id} className="sketch-card-elevated sketch-card-interactive team-card">
                  <div className="team-avatar-frame">
                    <img
                      src={member.avatarUrl || "/assets/team-1.svg"}
                      alt={member.name}
                      className="team-avatar-img"
                    />
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary-chunky team-linkedin-btn"
                      >
                        <Linkedin size={16} strokeWidth={2.4} />
                        <span>LinkedIn</span>
                        <ArrowUpRight size={14} strokeWidth={2.4} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PLAYTEST CALLOUT BANNER */}
        <section className="playtest-banner-section">
          <div className="container">
            <div className="playtest-banner sketch-card">
              <img
                src="/assets/jastip-passport-booth.png"
                alt="JASTIP passport and TSX-26 Booth C2 exhibition boarding pass"
                className="playtest-banner-img"
              />
              <div className="playtest-banner-copy">
                <h2>Ready to Pack Your Luggage?</h2>
                <p>
                  Try the JASTIP iOS companion app on TestFlight and experience the hybrid tabletop showcase at TSX-26 (Apple Developer Academy @ BINUS, Booth C2).
                </p>
              </div>
              <button
                type="button"
                className="btn-primary-chunky"
                onClick={() => setPlaytestOpen(true)}
              >
                <Smartphone size={20} strokeWidth={2.5} />
                <span>{hero.ctaText || "Playtest Now"}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand-col">
            <div className="brand-lockup" style={{ marginBottom: 12 }}>
              <img src={hero.appIconUrl} alt={`${hero.appName} icon`} className="nav-app-icon" />
              <span className="font-display brand-name">{hero.appName}</span>
            </div>
            <p className="footer-desc">{footer.description}</p>
            <img
              src="/assets/dice-studio-oval.png"
              alt="DICE Studio"
              className="footer-studio-logo"
            />
          </div>

          <div className="footer-links-col">
            <h4 className="font-display">Explore</h4>
            <ul>
              {(footer.exploreLinks || []).map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4 className="font-display">Contact</h4>
            {footer.contactEmail && (
              <a href={`mailto:${footer.contactEmail}`} className="footer-email-link">
                <Mail size={16} strokeWidth={2.4} />
                <span>{footer.contactEmail}</span>
              </a>
            )}
            <ul className="footer-socials">
              {(footer.socialLinks || [])
                .filter((soc) => soc.url && soc.url.trim())
                .map((soc) => (
                  <li key={soc.id}>
                    <a
                      href={soc.url}
                      target={soc.url.startsWith("http") ? "_blank" : undefined}
                      rel={soc.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={(e) => handleLinkClick(e, soc.url)}
                    >
                      <span>{soc.label}</span>
                      {soc.url.startsWith("http") && <ArrowUpRight size={14} />}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <hr className="ticket-divider" style={{ marginBottom: 18 }} />
          <div className="footer-bottom-row">
            <p>{footer.copyright || "© 2026 DICE! Studio. All rights reserved."}</p>
          </div>
        </div>
      </footer>

      <PlaytestModal
        isOpen={playtestOpen}
        onClose={() => setPlaytestOpen(false)}
        hero={hero}
      />
    </div>
  );
}

