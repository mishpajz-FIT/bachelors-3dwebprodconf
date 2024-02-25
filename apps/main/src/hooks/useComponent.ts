import { useSnapshot } from "valtio";

import { useComponentSpec } from "./useComponentSpec.ts";
import { UserCreationStore } from "../stores/UserCreationStore.ts";

export function useComponent(componentId: string) {
  const userCreationSnap = useSnapshot(UserCreationStore);

  const component = userCreationSnap.components[componentId];
  if (!component) {
    throw new Error(`Component ${componentId} not found`);
  }

  const componentSpecId = component.componentSpec;
  const componentSpec = useComponentSpec(componentSpecId);

  return { component, componentSpec, componentSpecId };
}
