import { globalConfig } from "../configurations/Config.ts";
import { ConfiguratorValuesNonReactiveStore } from "../stores/ConfiguratorValuesStore.ts";

export const refreshBounds = (delay = false) => {
  const action = () => {
    const bounds = ConfiguratorValuesNonReactiveStore.bounds;
    if (!bounds) return;

    bounds.refresh();
    if (globalConfig.config.camera.isOrthogonal) {
      bounds.reset();
    }

    bounds.clip();
    bounds.fit();
  };

  if (!delay) {
    action();
    return;
  }

  setTimeout(action, 100);
};
