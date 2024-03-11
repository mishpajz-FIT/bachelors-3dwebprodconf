import { globalConfig } from "../configurations/Config.ts";

export function setCSSVariables() {
  const root = document.documentElement;

  root.style.setProperty(
    "--primary-light",
    globalConfig.config.ui.colors.primary.light
  );
  root.style.setProperty(
    "--primary-dark",
    globalConfig.config.ui.colors.primary.light
  );

  root.style.setProperty(
    "--error-light",
    globalConfig.config.ui.colors.error.light
  );
  root.style.setProperty(
    "--error-dark",
    globalConfig.config.ui.colors.error.dark
  );

  root.style.setProperty(
    "--primary-overlay-light",
    globalConfig.config.ui.colors.primary.overlayTextWhiteLight
      ? "rgb(255 255 255)"
      : "rgb(2 6 23)"
  );

  root.style.setProperty(
    "--primary-overlay-dark",
    globalConfig.config.ui.colors.primary.overlayTextWhiteDark
      ? "rgb(255 255 255)"
      : "rgb(2 6 23)"
  );
}
