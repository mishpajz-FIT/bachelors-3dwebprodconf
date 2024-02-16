import { useSnapshot } from "valtio";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export function useSelectedMountingPointSpec() {
  const componentsSnap = useSnapshot(ComponentsStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentSpecId = editorValuesSnap.selectedComponentSpec;
  if (!componentSpecId) {
    throw new Error(`No component selected`);
  }

  const component =
    componentsSnap.components[editorValuesSnap.selectedComponentSpec];
  if (!component) {
    throw new Error(`No component specification with ${componentSpecId}`);
  }

  const mountingPointSpecId = editorValuesSnap.selectedMountingPoint;
  if (!mountingPointSpecId) {
    throw new Error(`No mounting point selected`);
  }

  const mountingPoint = component.mountingPointsSpecs[mountingPointSpecId];
  if (!mountingPoint) {
    throw new Error(
      `No mounting point specification with ${mountingPointSpecId} on component ${componentSpecId}`
    );
  }

  return { mountingPointSpecId, mountingPoint };
}
