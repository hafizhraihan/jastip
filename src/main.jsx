import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/layout.css";
import { App } from "./App.jsx";
import siteData from "../data/site-data.json";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App initialData={siteData} />
  </React.StrictMode>
);

