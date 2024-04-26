import { EditorValuesStore } from "../EditorValuesStore.ts";

export class EditorActions {
  static reset(store: EditorValuesStore) {
    store.selectedComponentSpec = undefined;
    store.previewedMountedComponent = undefined;
    store.selectedMountingPoint = undefined;
    store.selectedMaterial = undefined;
  }
}
