import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/layout.css";
import { App } from "./App.jsx";
import { defaultSiteData } from "../server/defaultData.js";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App initialData={defaultSiteData} />
  </React.StrictMode>
);

