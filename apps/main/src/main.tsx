import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { globalConfig, globalConfigUrl } from "./configurations/Config.ts";
import { AppConfigSchema } from "./schemas/AppConfig.ts";

fetch(globalConfigUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    globalConfig.config = AppConfigSchema.parse(data);
  })
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error(error);

    return ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <p className="text-red-600">Error fetching global configuration.</p>
      </React.StrictMode>
    );
  });
