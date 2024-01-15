export interface Config {
  camera: {
    isOrthogonal: boolean;
  };
  shadows: {
    floorShadow: boolean;
  };
  ui: {
    colors: {
      primary: {
        light: string;
        dark: string;
        overlayTextWhiteLight: boolean;
        overlayTextWhiteDark: boolean;
      };
    };
  };
  spatialUi: {
    selectionColors: {
      outline: string;
    };
  };
}
