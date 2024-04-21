import { EditorValuesNonReactiveStore } from "../stores/EditorValuesStore.ts";

export const refreshBounds = () => {
  const bounds = EditorValuesNonReactiveStore.bounds;
  if (!bounds) {
    return;
  }

  bounds.refresh(EditorValuesNonReactiveStore.currentGroup);
  bounds.clip();
  bounds.fit();
};
