import { EditorValuesStore } from "../EditorValuesStore.ts";

export class EditorActions {
  static reset(store: typeof EditorValuesStore) {
    store.selectedComponentSpec = undefined;
    store.previewedMountedComponent = undefined;
    store.selectedMountingPoint = undefined;
    store.selectedMaterial = undefined;
  }
}
