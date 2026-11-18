import React, { useState, useEffect } from "react";
import { LandingPage } from "./pages/LandingPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { PaperGrainOverlay } from "./components/HandDrawnArt.jsx";

export function App({ initialData }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [route, setRoute] = useState(() =>
    window.location.pathname.startsWith("/admin") ? "/admin" : "/"
  );
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("jastip-theme");
      return saved === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("jastip-theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname.startsWith("/admin") ? "/admin" : "/");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => {
        if (mounted && json && json.hero) {
          setData(json);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const navigate = (nextPath) => {
    const normalized = nextPath.startsWith("/admin") ? "/admin" : "/";
    if (window.location.pathname !== normalized) {
      window.history.pushState({}, "", normalized);
    }
    setRoute(normalized);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (loading || !data) {
    return (
      <div className="paper-canvas" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <PaperGrainOverlay />
        <div className="sketch-card-elevated" style={{ padding: "24px 32px" }}>
          <span className="font-display" style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            Unpacking JASTIP...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <PaperGrainOverlay />
      {route === "/admin" ? (
        <AdminPage
          data={data}
          onDataSaved={(saved) => setData(saved)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigate}
        />
      ) : (
        <LandingPage
          data={data}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={navigate}
        />
      )}
    </>
  );
}

