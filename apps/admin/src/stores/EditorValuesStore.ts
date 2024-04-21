import { BoundsStorage } from "@3dwebprodconf/shared/src/interfaces/BoundsStorage.ts";
import { Group } from "three";
import { proxy } from "valtio";

interface EditorValuesStore {
  selectedComponentSpec?: string;
  selectedMountingPoint?: string;
  selectedMaterial?: string;
  previewedMountedComponent?: string;
  boundingBoxSize?: [number, number, number];
}

export const EditorValuesStore = proxy<EditorValuesStore>({
  selectedComponentSpec: undefined,
  selectedMountingPoint: undefined,
  selectedMaterial: undefined,
  previewedMountedComponent: undefined,
  boundingBoxSize: undefined,
});

interface EditorValuesNonReactiveStore {
  currentGroup: Group | undefined;
}

export const EditorValuesNonReactiveStore: EditorValuesNonReactiveStore &
  BoundsStorage = {
  currentGroup: undefined,
  bounds: undefined,
};
