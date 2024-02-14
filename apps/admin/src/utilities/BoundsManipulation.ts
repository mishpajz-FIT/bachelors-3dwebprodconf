import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export const refreshBounds = () => {
  const bounds = EditorValuesStore.bounds;
  if (!bounds) {
    return;
  }

  bounds.refresh();
  bounds.clip();
  bounds.fit();
};
