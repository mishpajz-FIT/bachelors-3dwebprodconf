import { BoundsStorage } from "@3dwebprodconf/shared/src/interfaces/BoundsStorage.ts";
import { Group, Scene } from "three";
import { proxy, subscribe } from "valtio";

interface ConfiguratorValuesStore {
  selectedComponentId?: string;
  scene: Scene | undefined;
  showMountingPoints: boolean;
  selectedInGroup: Group | undefined;
}

export const ConfiguratorValuesStore = proxy<
  ConfiguratorValuesStore & BoundsStorage
>({
  selectedComponentId: undefined,
  scene: undefined,
  bounds: undefined,
  showMountingPoints: true,
  selectedInGroup: undefined,
});

subscribe(ConfiguratorValuesStore, () => {
  if (ConfiguratorValuesStore.selectedComponentId === undefined) {
    ConfiguratorValuesStore.selectedInGroup = undefined;
  }
});
