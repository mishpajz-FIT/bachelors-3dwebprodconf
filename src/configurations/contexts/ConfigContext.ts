import { createContext } from "react";

import { Config } from "../Config.ts";

export const DefaultConfig: Config = {
  camera: {
    isOrthogonal: false,
  },
  shadows: {
    floorShadow: false,
  },
  spatialUi: {
    selectionColors: {
      outline: "#000000",
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
};

export const ConfigContext = createContext(DefaultConfig);
