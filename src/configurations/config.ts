export interface Config {
  camera: {
    isOrthogonal: boolean; // set this to true for orthogonal, false for perspective
  };
  spacialUi: {
    buttonColors: {
      default: string;
      hover: string;
    };
    selectionColors: {
      outline: string;
    }
  };
}
