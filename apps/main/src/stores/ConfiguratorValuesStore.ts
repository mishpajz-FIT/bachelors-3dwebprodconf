import { BoundsStorage } from "@3dwebprodconf/shared/src/interfaces/BoundsStorage.ts";
import { proxy } from "valtio";

interface ConfiguratorValuesStore {
  currentProductId?: string;
  selectedComponentId?: string;
}

export const ConfiguratorValuesStore = proxy<
  ConfiguratorValuesStore & BoundsStorage
>({
  currentProductId: undefined,
  selectedComponentId: undefined,
  bounds: undefined,
});
