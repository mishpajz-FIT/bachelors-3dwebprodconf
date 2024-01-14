import { Config } from "./config.ts";

export const appConfig: Config = {
  camera: {
    isOrthogonal: false,
  },
  shadows: {
    floorShadow: false,
  },
  spacialUi: {
    buttonColors: {
      default: "#0011ff",
      hover: "#3377ff",
    },
    selectionColors: {
      outline: "#000000",
    },
  },
};
