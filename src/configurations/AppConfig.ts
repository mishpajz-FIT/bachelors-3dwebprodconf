import {Config} from "./config.ts";

export const appConfig: Config = {
  camera: {
    isOrthogonal: true, // set this to true for orthogonal, false for perspective
  },
  spacialUi: {
    buttonColors: {
      default: "#0011ff", // default blue
      hover: "#3377ff",   // darker blue for hover state
    },
  },
};
