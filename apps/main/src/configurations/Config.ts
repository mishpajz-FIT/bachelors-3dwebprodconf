import { AppConfig } from "../interfaces/AppConfig.ts";

const defaultConfig: AppConfig = {
  camera: {
    isOrthogonal: false,
  },
  shadows: {
    floorShadow: false,
  },
  spatialUi: {
    selectionColors: {
      outline: {
        light: "#000000",
        dark: "#FFFFFF",
      },
    },
  },
  ui: {
    colors: {
      primary: {
        light: "#3377ff",
        dark: "#0011ff",
        overlayTextWhiteLight: true,
        overlayTextWhiteDark: true,
      },
    },
  },
  sources: {
    catalogue: "/products/catalogue.json",
  },
  capabilities: {
    savePdfButton: true,
  },
};

class GlobalConfig {
  config: AppConfig = defaultConfig;
}

export const globalConfig = new GlobalConfig();

export const globalConfigUrl = "/appconfig.json";
