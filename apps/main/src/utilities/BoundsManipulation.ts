import { globalConfig } from "../configurations/Config.ts";
import { ConfiguratorValuesStore } from "../stores/ConfiguratorValuesStore.ts";

export const refreshBounds = (action: () => void) => {
  action();

  const bounds = ConfiguratorValuesStore.bounds;
  if (!bounds) {
    return;
  }

  bounds.refresh(ConfiguratorValuesStore.selectedInGroup);
  if (globalConfig.config.camera.isOrthogonal) {
    bounds.reset();
  }

  bounds.clip();
  bounds.fit();
};
