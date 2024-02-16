import { useSnapshot } from "valtio";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export function useSelectedComponentSpec() {
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

  return { componentSpecId, component };
}
