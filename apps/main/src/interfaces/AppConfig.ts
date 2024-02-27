export interface AppConfig {
  camera: {
    isOrthogonal: boolean;
  };
  shadows: {
    floorShadow: boolean;
  };
  spatialUi: {
    selectionColors: {
      outline: {
        light: string;
        dark: string;
      };
    };
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
  sources: {
    catalogue: string;
  };
}
