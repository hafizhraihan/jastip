import React, { useState } from "react";

export function PaperGrainOverlay() {
  return (
    <svg className="figma-grain-overlay" aria-hidden="true">
      <filter id="jastip-paper-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.78"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#jastip-paper-noise)" />
    </svg>
  );
}

export function SquiggleUnderline({ width = 180 }) {
  return (
    <svg
      width={width}
      height="14"
      viewBox="0 0 180 14"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", marginTop: 4 }}
    >
      <path
        d="M3 9C24 2 45 12 68 6C91 0 112 12 135 6C153 1 167 8 177 5"
        stroke="var(--accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HandDrawnConnector() {
  return (
    <svg
      width="72"
      height="48"
      viewBox="0 0 72 48"
      fill="none"
      aria-hidden="true"
      className="hybrid-connector-svg"
    >
      <path
        d="M6 24C20 12 52 12 64 24"
        stroke="var(--stroke)"
        strokeWidth="3"
        strokeDasharray="6 5"
        strokeLinecap="round"
      />
      <path
        d="M56 17L65 24L56 31"
        stroke="var(--stroke)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="36"
        cy="17"
        r="11"
        fill="#FFD102"
        stroke="var(--stroke)"
        strokeWidth="2.5"
      />
      <path
        d="M36 12V22M31 17H41"
        stroke="#000000"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const PACKING_ITEMS = [
  { id: "matcha", name: "Matcha Tin", size: "1×2", color: "#FFD102", cells: [0, 1] },
  { id: "sneakers", name: "Sneaker Box", size: "2×2", color: "#933030", cells: [4, 5, 8, 9] },
  { id: "skincare", name: "Serum Set", size: "1×2", color: "#E9964A", cells: [6, 10] },
  { id: "gacha", name: "Gachapon", size: "1×1", color: "#5FA37D", cells: [14] }
];

export function HeroTabletopScene() {
  const [packedIds, setPackedIds] = useState(["matcha", "sneakers", "skincare"]);

  const toggleItem = (id) => {
    setPackedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const occupiedMap = {};
  PACKING_ITEMS.forEach((item) => {
    if (packedIds.includes(item.id)) {
      item.cells.forEach((cellIdx) => {
        occupiedMap[cellIdx] = item.color;
      });
    }
  });

  const packedCount = packedIds.length;

  return (
    <div className="hero-scene-wrap">
      {/* Decorative Hand-drawn Tabletop Board Card behind phone */}
      <div className="hero-tabletop-card sketch-card">
        <div className="hero-tabletop-header">
          <span className="hero-card-tag">TOKYO STOP • GATE 7</span>
          {/* Hand-drawn Dice */}
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect
              x="3"
              y="3"
              width="28"
              height="28"
              rx="7"
              fill="#FFD102"
              stroke="var(--stroke)"
              strokeWidth="2.8"
            />
            <circle cx="11" cy="11" r="2.4" fill="#000" />
            <circle cx="23" cy="11" r="2.4" fill="#000" />
            <circle cx="17" cy="17" r="2.4" fill="#000" />
            <circle cx="11" cy="23" r="2.4" fill="#000" />
            <circle cx="23" cy="23" r="2.4" fill="#000" />
          </svg>
        </div>

        <div className="hero-order-tickets">
          <div className="hero-ticket">
            <strong>Titipan #12:</strong> Matcha KitKat ×2
            <span className="ticket-tip">+180 pts</span>
          </div>
          <div className="hero-ticket">
            <strong>Titipan #19:</strong> Retro Sneakers
            <span className="ticket-tip">+320 pts</span>
          </div>
        </div>

        <p className="hero-tap-hint">
          Tap souvenirs below to test-pack the iOS suitcase →
        </p>

        <div className="hero-item-chips">
          {PACKING_ITEMS.map((item) => {
            const active = packedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`hero-item-chip ${active ? "is-packed" : ""}`}
              >
                <span
                  className="chip-swatch"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
                <small>{item.size}</small>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlapping Hand-Drawn iPhone Companion */}
      <div className="hero-phone-frame">
        <div className="phone-speaker-notch" />
        <div className="phone-screen-inner">
          <div className="phone-topbar">
            <span className="font-display" style={{ fontWeight: 700, fontSize: "0.78rem" }}>
              CARRY-ON 4×4
            </span>
            <span className="phone-timer-pill">01:42</span>
          </div>

          <div className="mini-packing-grid" role="grid" aria-label="Interactive Packing Grid">
            {Array.from({ length: 16 }).map((_, idx) => {
              const fill = occupiedMap[idx];
              return (
                <div
                  key={idx}
                  className={`mini-grid-cell ${fill ? "is-filled" : ""}`}
                  style={fill ? { backgroundColor: fill } : undefined}
                />
              );
            })}
          </div>

          <div className="phone-bottom-bar">
            <span>{packedCount}/4 Orders Packed</span>
            <span className="phone-ready-dot">
              {packedCount === 4 ? "Ready!" : "Tap tiles"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureArtwork({ visualType, imageUrl, title }) {
  if (imageUrl) {
    return (
      <div className="feature-art-box has-image">
        <img src={imageUrl} alt={title} className="feature-custom-img" />
      </div>
    );
  }

  if (visualType === "packing-grid") {
    return (
      <div className="feature-art-box">
        <svg viewBox="0 0 220 130" fill="none" className="feature-svg">
          {/* Suitcase outline */}
          <rect
            x="28"
            y="18"
            width="164"
            height="98"
            rx="14"
            fill="var(--surface-card)"
            stroke="var(--stroke)"
            strokeWidth="3"
          />
          {/* Handle */}
          <path
            d="M88 18V10C88 8 90 6 92 6H128C130 6 132 8 132 10V18"
            stroke="var(--stroke)"
            strokeWidth="3"
          />
          {/* 4x3 Grid Lines */}
          <path
            d="M44 34H176M44 56H176M44 78H176M44 100H176M44 34V100M77 34V100M110 34V100M143 34V100M176 34V100"
            stroke="var(--stroke)"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {/* Polyomino blocks */}
          <rect
            x="46"
            y="36"
            width="62"
            height="40"
            rx="7"
            fill="#FFD102"
            stroke="var(--stroke)"
            strokeWidth="2.5"
          />
          <rect
            x="112"
            y="36"
            width="29"
            height="62"
            rx="7"
            fill="#933030"
            stroke="var(--stroke)"
            strokeWidth="2.5"
          />
          <rect
            x="46"
            y="80"
            width="62"
            height="18"
            rx="6"
            fill="#5FA37D"
            stroke="var(--stroke)"
            strokeWidth="2.5"
          />
          <rect
            x="145"
            y="58"
            width="29"
            height="40"
            rx="7"
            fill="#E9964A"
            stroke="var(--stroke)"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    );
  }

  if (visualType === "multiplayer") {
    return (
      <div className="feature-art-box">
        <svg viewBox="0 0 220 130" fill="none" className="feature-svg">
          {/* Table Circle */}
          <ellipse
            cx="110"
            cy="74"
            rx="72"
            ry="34"
            fill="var(--surface-card)"
            stroke="var(--stroke)"
            strokeWidth="3"
          />
          {/* Player Pawns / Avatars */}
          <circle cx="52" cy="48" r="17" fill="#FFD102" stroke="var(--stroke)" strokeWidth="2.8" />
          <circle cx="47" cy="46" r="2.2" fill="#000" />
          <circle cx="57" cy="46" r="2.2" fill="#000" />
          <path d="M47 53C50 56 54 56 57 53" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />

          <circle cx="168" cy="48" r="17" fill="#933030" stroke="var(--stroke)" strokeWidth="2.8" />
          <circle cx="163" cy="46" r="2.2" fill="#FFF" />
          <circle cx="173" cy="46" r="2.2" fill="#FFF" />
          <path d="M163 53C166 56 170 56 173 53" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" />

          <circle cx="110" cy="28" r="17" fill="#5FA37D" stroke="var(--stroke)" strokeWidth="2.8" />
          <circle cx="105" cy="26" r="2.2" fill="#000" />
          <circle cx="115" cy="26" r="2.2" fill="#000" />
          <path d="M105 33C108 36 112 36 115 33" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />

          {/* Sync Waves & Central Phone */}
          <rect
            x="93"
            y="54"
            width="34"
            height="46"
            rx="8"
            fill="#FFD102"
            stroke="var(--stroke)"
            strokeWidth="2.8"
          />
          <rect x="99" y="61" width="22" height="28" rx="3" fill="var(--surface-card)" stroke="var(--stroke)" strokeWidth="2" />
          <path d="M68 58C77 62 84 65 90 68" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
          <path d="M152 58C143 62 136 65 130 68" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (visualType === "jastip-orders") {
    return (
      <div className="feature-art-box">
        <svg viewBox="0 0 220 130" fill="none" className="feature-svg">
          {/* Back Order Ticket */}
          <g transform="rotate(-6 110 65)">
            <rect
              x="44"
              y="20"
              width="124"
              height="74"
              rx="12"
              fill="#FFD102"
              stroke="var(--stroke)"
              strokeWidth="2.8"
            />
          </g>
          {/* Front Order Ticket */}
          <g transform="rotate(3 110 70)">
            <rect
              x="48"
              y="32"
              width="132"
              height="76"
              rx="12"
              fill="var(--surface-card)"
              stroke="var(--stroke)"
              strokeWidth="3"
            />
            <rect x="60" y="46" width="38" height="38" rx="8" fill="#933030" stroke="var(--stroke)" strokeWidth="2.2" />
            <path d="M71 65L77 71L89 57" stroke="#FFF9F2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M108 54H162M108 66H148" stroke="var(--stroke)" strokeWidth="3" strokeLinecap="round" />
            <rect x="108" y="76" width="54" height="18" rx="9" fill="#FFD102" stroke="var(--stroke)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    );
  }

  // Fallback hand-drawn star/dice ticket for custom admin features
  return (
    <div className="feature-art-box">
      <svg viewBox="0 0 220 130" fill="none" className="feature-svg">
        <rect
          x="52"
          y="24"
          width="116"
          height="82"
          rx="16"
          fill="#FFD102"
          stroke="var(--stroke)"
          strokeWidth="3"
        />
        <path
          d="M110 40L117 56L134 58L121 69L125 86L110 77L95 86L99 69L86 58L103 56L110 40Z"
          fill="var(--surface-card)"
          stroke="var(--stroke)"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function PhonePreviewScreen({ preview }) {
  const [selectedPiece, setSelectedPiece] = useState(0);

  if (preview.imageUrl) {
    return (
      <div className="preview-device-frame">
        <div className="preview-device-notch" />
        <img
          src={preview.imageUrl}
          alt={preview.title}
          className="preview-uploaded-img"
        />
      </div>
    );
  }

  const preset = preview.screenPreset || "packing";

  return (
    <div className="preview-device-frame">
      <div className="preview-device-notch" />
      <div className="preview-device-screen">
        {preset === "packing" && (
          <div className="sim-screen">
            <div className="sim-header">
              <span className="font-display">Packing Grid</span>
              <span className="sim-badge">14/16 Full</span>
            </div>
            <div className="sim-grid-5">
              {[
                "#FFD102", "#FFD102", "#5FA37D", "", "",
                "#FFD102", "#FFD102", "#5FA37D", "#933030", "#933030",
                "#E9964A", "#E9964A", "#E9964A", "#933030", "#933030",
                "", "#6F8FAF", "#6F8FAF", "", "",
                "", "", "#FFD102", "#FFD102", ""
              ].map((col, idx) => (
                <div
                  key={idx}
                  className="sim-cell"
                  style={{
                    backgroundColor: col || "transparent",
                    opacity: selectedPiece === 1 && col === "#FFD102" ? 0.65 : 1
                  }}
                />
              ))}
            </div>
            <div className="sim-tray">
              {["Rotate 90°", "Check Fit"].map((lbl, i) => (
                <button
                  key={lbl}
                  type="button"
                  className={`sim-mini-btn ${selectedPiece === i ? "is-active" : ""}`}
                  onClick={() => setSelectedPiece(i)}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        )}

        {preset === "orders" && (
          <div className="sim-screen">
            <div className="sim-header">
              <span className="font-display">Jastip Orders</span>
              <span className="sim-badge">Tokyo</span>
            </div>
            <div className="sim-order-list">
              <div className="sim-order-card">
                <div>
                  <strong>Matcha Crepe Box</strong>
                  <small>From: Maya • 2×1 tile</small>
                </div>
                <span className="sim-pts">+240</span>
              </div>
              <div className="sim-order-card is-hot">
                <div>
                  <strong>Limited Drop Sneakers</strong>
                  <small>From: Andi • 2×2 tile</small>
                </div>
                <span className="sim-pts">+450</span>
              </div>
              <div className="sim-order-card">
                <div>
                  <strong>Yuzu Lip Balm Set</strong>
                  <small>From: Tari • 1×1 tile</small>
                </div>
                <span className="sim-pts">+120</span>
              </div>
            </div>
          </div>
        )}

        {preset === "multiplayer" && (
          <div className="sim-screen">
            <div className="sim-header">
              <span className="font-display">Flight Gate 4</span>
              <span className="sim-badge">Round 3/4</span>
            </div>
            <div className="sim-leaderboard">
              {[
                { name: "Raka (You)", score: "1,120 pts", color: "#FFD102" },
                { name: "Nadia", score: "980 pts", color: "#933030" },
                { name: "Dimas", score: "840 pts", color: "#5FA37D" },
                { name: "Salsa", score: "790 pts", color: "#E9964A" }
              ].map((player, idx) => (
                <div key={player.name} className="sim-player-row">
                  <span className="sim-rank">{idx + 1}</span>
                  <span
                    className="sim-dot"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="sim-name">{player.name}</span>
                  <strong>{player.score}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

