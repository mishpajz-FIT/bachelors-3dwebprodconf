import { BoundsStorage } from "@3dwebprodconf/shared/src/interfaces/BoundsStorage.ts";
import { proxy } from "valtio";

interface EditorValuesStore {
  selectedComponentSpec?: string;
  boundingBoxSize?: [number, number, number];
}

export const EditorValuesStore = proxy<EditorValuesStore & BoundsStorage>({
  selectedComponentSpec: undefined,
  boundingBoxSize: undefined,
  bounds: undefined,
});
