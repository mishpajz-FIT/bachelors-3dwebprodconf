import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { useEffect } from "react";

import { globalConfig } from "./configurations/Config.ts";
import { setCSSVariables } from "./utilities/CSSVariables.ts";

export function AppContent() {
  const isDarkMode = useDarkMode();

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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return <></>;
}
