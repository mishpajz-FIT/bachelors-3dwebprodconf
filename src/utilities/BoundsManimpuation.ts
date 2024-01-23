import { globalConfig } from "../configurations/Config.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export const refreshBounds = (action: () => void) => {
  action();

  const bounds = EditorValuesStore.bounds;
  console.log(bounds);
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
