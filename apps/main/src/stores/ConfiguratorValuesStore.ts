import { BoundsStorage } from "@3dwebprodconf/shared/src/interfaces/BoundsStorage.ts";
import { Group, Scene } from "three";
import { proxy, subscribe } from "valtio";

interface ConfiguratorValuesStore {
  selectedComponentId?: string;
  showMountingPoints: boolean;
}

export const ConfiguratorValuesStore = proxy<ConfiguratorValuesStore>({
  selectedComponentId: undefined,
  showMountingPoints: true,
});

subscribe(ConfiguratorValuesStore, () => {
  if (ConfiguratorValuesStore.selectedComponentId === undefined) {
    ConfiguratorValuesNonReactiveStore.currentGroup = undefined;
  }
});

interface ConfiguratorValuesNonReactiveStore {
  scene: Scene | undefined;
  currentGroup: Group | undefined;
}

export const ConfiguratorValuesNonReactiveStore: ConfiguratorValuesNonReactiveStore &
  BoundsStorage = {
  scene: undefined,
  currentGroup: undefined,
  bounds: undefined,
};
