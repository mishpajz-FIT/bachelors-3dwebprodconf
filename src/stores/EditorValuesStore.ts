import { proxy } from "valtio";

interface EditorValuesStore {
  currentProductId?: string;
  selectedComponentId?: string;
}

export const EditorValuesStore = proxy<EditorValuesStore>({
  currentProductId: undefined,
  selectedComponentId: undefined,
});
