import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";
import { appConfig } from "./configurations/AppConfig.ts";

const setCSSVariables = () => {
  const root = document.documentElement;

  root.style.setProperty("--primary-light", appConfig.ui.colors.primary.light);
  root.style.setProperty("--primary-dark", appConfig.ui.colors.primary.light);

  root.style.setProperty(
    "--primary-overlay-light",
    appConfig.ui.colors.primary.overlayTextWhiteLight
      ? "rgb(255 255 255)"
      : "rgb(2 6 23)"
  );

  root.style.setProperty(
    "--primary-overlay-dark",
    appConfig.ui.colors.primary.overlayTextWhiteDark
      ? "rgb(255 255 255)"
      : "rgb(2 6 23)"
  );
};

setCSSVariables();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
