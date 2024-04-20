import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AppContent } from "./AppContent.tsx";
import { TopBar } from "./components/TopBar.tsx";
import { globalConfig, globalConfigUrl } from "./configurations/Config.ts";
import { routes } from "./Routes.tsx";
import { AppConfigSchema } from "./schemas/AppConfig.ts";
import { configureI18n } from "./utilities/i18n.ts";

const container = document.getElementById("root")!;
const root = ReactDOM.createRoot(container);

fetch(globalConfigUrl)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    globalConfig.config = AppConfigSchema.parse(data);
  })
  .then(() => {
    const i18n = configureI18n();
    const router = createBrowserRouter(routes);

    root.render(
      <React.StrictMode>
        <I18nextProvider i18n={i18n}>
          <AppContent />
          <TopBar>
            <Toaster position="top-right" reverseOrder={true} />
            <RouterProvider router={router} />
          </TopBar>
        </I18nextProvider>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error(error);
    root.render(
      <p className="text-red-600">Fatal error: missing appconfig.</p>
    );
  });
