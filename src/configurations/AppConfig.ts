import { Config } from "./config.ts";

export const appConfig: Config = {
  camera: {
    isOrthogonal: false,
  },
  shadows: {
    floorShadow: false,
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
  spatialUi: {
    selectionColors: {
      outline: "#000000",
    },
  },
};
