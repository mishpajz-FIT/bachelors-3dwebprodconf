import { useContext, useEffect } from "react";

import { AppContent } from "./AppContent.tsx";
import { ConfigContext } from "./configurations/contexts/ConfigContext.ts";

function App() {
  const appConfig = useContext(ConfigContext);

  useEffect(() => {
    const setCSSVariables = () => {
      const root = document.documentElement;

      root.style.setProperty(
        "--primary-light",
        appConfig.ui.colors.primary.light
      );
      root.style.setProperty(
        "--primary-dark",
        appConfig.ui.colors.primary.light
      );

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
  }, [appConfig]);

  return <AppContent />;
}

export default App;
