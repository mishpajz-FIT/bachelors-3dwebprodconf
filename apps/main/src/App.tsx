import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import { AppContent } from "./AppContent.tsx";
import { globalConfig } from "./configurations/Config.ts";
import { setCSSVariables } from "./utilities/CSSVariables.ts";
import i18n from "./utilities/i18n.ts";

function App() {
  useEffect(() => {
    setCSSVariables();
  }, []);

  useEffect(() => {
    document.title = globalConfig.config.title;
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = globalConfig.config.images.favicon;
    document.getElementsByTagName("head")[0].appendChild(link);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}

export default App;
