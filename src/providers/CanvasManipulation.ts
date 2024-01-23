import { globalConfig } from "../configurations/Config.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export const manipulateCanvas = (action: () => void) => {
  action();

  const bounds = EditorValuesStore.bounds;
  if (!bounds) {
    return;
  }

  bounds.refresh();
  if (globalConfig.config.camera.isOrthogonal) {
    bounds.reset();
  }
  bounds.clip();
  bounds.fit();
};
