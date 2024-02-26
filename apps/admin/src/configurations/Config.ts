import { AdminConfig } from "../interfaces/AdminConfig.ts";

export const defaultAdminConfig: AdminConfig = {
  spatialUi: {
    gizmoColors: {
      b: { dark: "#3e38f3", light: "#0c89f1" },
      g: { dark: "#33d049", light: "#02f54f" },
      r: { dark: "#c94530", light: "#f93307" },
    },
    gridColors: {
      primary: { dark: "#0011ff", light: "#3377ff" },
      secondary: { dark: "#858484", light: "#757575" },
    },
  },
  ui: {
    colors: {
      primary: {
        dark: "#0011ff",
        light: "#3377ff",
        overlayTextWhiteDark: true,
        overlayTextWhiteLight: true,
      },
    },
  },
};
