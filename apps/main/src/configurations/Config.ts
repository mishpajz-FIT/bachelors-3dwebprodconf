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
    products: string;
  };
}

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
    products: "/products/products.json",
  },
};

class GlobalConfig {
  config: AppConfig = defaultConfig;
}

export const globalConfig = new GlobalConfig();

export const globalConfigUrl = "/appconfig.json";
