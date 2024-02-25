import { useSnapshot } from "valtio";

import { ProductStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export function useSelectedComponentSpec() {
  const productSnap = useSnapshot(ProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentSpecId = editorValuesSnap.selectedComponentSpec;
  if (!componentSpecId) {
    throw new Error(`No component selected`);
  }

  const componentSpec =
    productSnap.componentSpecs[editorValuesSnap.selectedComponentSpec];
  if (!componentSpec) {
    throw new Error(`No component specification with ${componentSpecId}`);
  }

  return { componentSpecId, componentSpec };
}
