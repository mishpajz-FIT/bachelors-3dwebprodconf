import { useSnapshot } from "valtio";

import { useSelectedComponentSpec } from "./useSelectedComponentSpec.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export function useSelectedMountingPointSpec() {
  const editorValuesSnap = useSnapshot(EditorValuesStore);
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();

  const mountingPointSpecId = editorValuesSnap.selectedMountingPoint;
  if (!mountingPointSpecId) {
    throw new Error(`No mounting point selected`);
  }

  const mountingPointSpec =
    componentSpec.mountingPointsSpecs[mountingPointSpecId];
  if (!mountingPointSpec) {
    throw new Error(
      `No mounting point specification with ${mountingPointSpecId} on component ${componentSpecId}`
    );
  }

  return { mountingPointSpecId, mountingPointSpec };
}
