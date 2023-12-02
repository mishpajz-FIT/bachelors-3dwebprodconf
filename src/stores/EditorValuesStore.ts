import {proxy} from "valtio";

export const EditorValuesStore = proxy({
  selectedComponentId: undefined as string | undefined,
});
