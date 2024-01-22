import { Config } from "../configurations/Config.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export const manipulateCanvas = (action: () => void, appConfig: Config) => {
  action();

  const bounds = EditorValuesStore.bounds;
  if (!bounds) {
    return;
  }

  bounds.refresh();
  if (appConfig.camera.isOrthogonal) {
    bounds.reset();
  }
  bounds.clip();
  bounds.fit();
};
