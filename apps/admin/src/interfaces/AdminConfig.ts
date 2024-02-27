export interface AdminConfig {
  spatialUi: {
    gizmoColors: {
      r: {
        light: string;
        dark: string;
      };
      g: {
        light: string;
        dark: string;
      };
      b: {
        light: string;
        dark: string;
      };
    };
    gridColors: {
      primary: {
        light: string;
        dark: string;
      };
      secondary: {
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
      error: {
        light: string;
        dark: string;
      };
    };
  };
}
