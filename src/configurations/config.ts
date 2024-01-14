export interface Config {
  camera: {
    isOrthogonal: boolean;
  };
  shadows: {
    floorShadow: boolean;
  };
  spacialUi: {
    buttonColors: {
      default: string;
      hover: string;
    };
    selectionColors: {
      outline: string;
    };
  };
}
