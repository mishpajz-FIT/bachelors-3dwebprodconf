import { AppConfig } from "../schemas/AppConfig.ts";

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
    controls: {
      swapMouseButtons: false,
    },
  },
  ui: {
    languages: {
      default: "en",
      all: ["en"],
    },
    colors: {
      primary: {
        light: "#3377ff",
        dark: "#0011ff",
        overlayTextWhiteLight: true,
        overlayTextWhiteDark: true,
      },
      error: {
        dark: "#f43f5e",
        light: "#f43f5e",
      },
    },
  },
  sources: {
    catalogUrl: "/products/catalogue.json",
    homepageUrl: "https://google.com",
  },
  capabilities: {
    savePdfButton: true,
  },
  images: {
    logo: {
      light: "/logo.svg",
      dark: "/logo.svg",
    },
    favicon: "/logo.svg",
  },
  title: "3dwebrpodconf",
  debug: {
    collisionDetectionDisplay: false,
  },
};

class GlobalConfig {
  config: AppConfig = defaultConfig;
}

export const globalConfig = new GlobalConfig();

export const globalConfigUrl = "/appconfig.json";
