import { useSnapshot } from "valtio";

import { useSelectedComponentSpec } from "./useSelectedComponentSpec.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export function useSelectedMaterialSpec() {
  const editorValuesSnap = useSnapshot(EditorValuesStore);
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();

  const materialSpecId = editorValuesSnap.selectedMaterial;
  if (!materialSpecId) {
    throw new Error(`No material selected`);
  }

  const materialSpec = componentSpec.materialSpecs[materialSpecId];
  if (!materialSpec) {
    throw new Error(
      `No material specification with ${materialSpecId} on component ${componentSpecId}`
    );
  }

  return { materialSpecId, materialSpec };
}
