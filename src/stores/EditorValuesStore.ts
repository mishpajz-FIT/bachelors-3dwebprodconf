import {proxy} from "valtio";

interface EditorValuesStore {
  selectedComponentId?: string
}

export const EditorValuesStore = proxy<EditorValuesStore>({
  selectedComponentId: undefined
});
