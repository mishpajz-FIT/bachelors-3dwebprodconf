import { globalConfig } from "../configurations/Config.ts";
import { ConfiguratorValuesNonReactiveStore } from "../stores/ConfiguratorValuesStore.ts";

export const refreshBounds = (action: () => void) => {
  action();

  const bounds = ConfiguratorValuesNonReactiveStore.bounds;
  if (!bounds) {
    return;
  }

  bounds.refresh(ConfiguratorValuesNonReactiveStore.currentGroup);
  if (globalConfig.config.camera.isOrthogonal) {
    bounds.reset();
  }

  bounds.clip();
  bounds.fit();
};
