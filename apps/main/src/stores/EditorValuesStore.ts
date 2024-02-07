import { BoundsApi } from "@react-three/drei";
import { proxy } from "valtio";

interface EditorValuesStore {
  currentProductId?: string;
  selectedComponentId?: string;
  bounds: BoundsApi | undefined;
}

export const EditorValuesStore = proxy<EditorValuesStore>({
  currentProductId: undefined,
  selectedComponentId: undefined,
  bounds: undefined,
});
