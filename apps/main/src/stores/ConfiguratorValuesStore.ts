import { BoundsStorage } from "@3dwebprodconf/shared/src/interfaces/BoundsStorage.ts";
import { Scene } from "three";
import { proxy } from "valtio";

interface ConfiguratorValuesStore {
  selectedComponentId?: string;
  scene: Scene | undefined;
}

export const ConfiguratorValuesStore = proxy<
  ConfiguratorValuesStore & BoundsStorage
>({
  selectedComponentId: undefined,
  scene: undefined,
  bounds: undefined,
});
