import { BoundsStorage } from "@3dwebprodconf/shared/src/interfaces/BoundsStorage.ts";
import { Group } from "three";
import { proxy } from "valtio";

export interface EditorValuesStore {
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

interface EditorValuesNonReactive {
  currentGroup: Group | undefined;
}

export type EditorValuesNonReactiveStore = EditorValuesNonReactive &
  BoundsStorage;

export const EditorValuesNonReactiveStore: EditorValuesNonReactiveStore = {
  currentGroup: undefined,
  bounds: undefined,
};
