export interface AppConfig {
  camera: {
    isOrthogonal: boolean;
  };
  shadows: {
    floorShadow: boolean;
  };
  spatialUi: {
    selectionColors: {
      outline: string;
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
  sources: {
    products: "/products/products.json",
  },
};

class GlobalConfig {
  config: AppConfig = defaultConfig;
}

export const globalConfig = new GlobalConfig();

export const globalConfigUrl = "/appconfig.json";
