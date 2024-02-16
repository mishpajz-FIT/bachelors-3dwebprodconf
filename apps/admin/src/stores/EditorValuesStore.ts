import { BoundsStorage } from "@3dwebprodconf/shared/src/interfaces/BoundsStorage.ts";
import { proxy } from "valtio";

interface EditorValuesStore {
  selectedComponentSpec?: string;
  selectedMountingPoint?: string;
  previewedMountedComponent?: string;
  boundingBoxSize?: [number, number, number];
}

export const EditorValuesStore = proxy<EditorValuesStore & BoundsStorage>({
  selectedComponentSpec: undefined,
  selectedMountingPoint: undefined,
  previewedMountedComponent: undefined,
  boundingBoxSize: undefined,
  bounds: undefined,
});
