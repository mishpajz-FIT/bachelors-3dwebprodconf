import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import {
  AppConfig,
  globalConfig,
  globalConfigUrl,
} from "./configurations/Config.ts";

fetch(globalConfigUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    globalConfig.config = data as AppConfig;
  })
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch(() => {
    return ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <p className="text-red-600">Error fetching global configuration.</p>
      </React.StrictMode>
    );
  });
