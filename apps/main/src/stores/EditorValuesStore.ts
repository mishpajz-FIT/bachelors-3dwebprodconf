import { BoundsStorage } from "@3dwebprodconf/shared/src/interfaces/BoundsStorage.ts";
import { proxy } from "valtio";

interface EditorValuesStore {
  currentProductId?: string;
  selectedComponentId?: string;
}

export const EditorValuesStore = proxy<EditorValuesStore & BoundsStorage>({
  currentProductId: undefined,
  selectedComponentId: undefined,
  bounds: undefined,
});
