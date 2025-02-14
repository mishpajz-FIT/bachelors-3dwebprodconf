import { defaultAdminConfig } from "../configurations/Config.ts";

export function setCSSVariables() {
  const root = document.documentElement;

  root.style.setProperty(
    "--primary-light",
    defaultAdminConfig.ui.colors.primary.light
  );
  root.style.setProperty(
    "--primary-dark",
    defaultAdminConfig.ui.colors.primary.dark
  );

  root.style.setProperty(
    "--error-light",
    defaultAdminConfig.ui.colors.error.light
  );
  root.style.setProperty(
    "--error-dark",
    defaultAdminConfig.ui.colors.error.dark
  );

  root.style.setProperty(
    "--primary-overlay-light",
    defaultAdminConfig.ui.colors.primary.overlayTextWhiteLight
      ? "rgb(255 255 255)"
      : "rgb(2 6 23)"
  );

  root.style.setProperty(
    "--primary-overlay-dark",
    defaultAdminConfig.ui.colors.primary.overlayTextWhiteDark
      ? "rgb(255 255 255)"
      : "rgb(2 6 23)"
  );
}
