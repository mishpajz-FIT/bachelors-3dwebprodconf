import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import App from "./App.tsx";
import { globalConfig, globalConfigUrl } from "./configurations/Config.ts";
import { AppConfigSchema } from "./schemas/AppConfig.ts";
import { configureI18n } from "./utilities/i18n.ts";

fetch(globalConfigUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    globalConfig.config = AppConfigSchema.parse(data);
  })
  .then(() => {
    const i18n = configureI18n();

    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error(error);

    return ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <p className="text-red-600">
          Fatal error: couldn&apos;t initialize appconfig.
        </p>
      </React.StrictMode>
    );
  });
