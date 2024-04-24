import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { useComponentSpec } from "./useComponentSpec.ts";
import { UserCreationStore } from "../stores/UserCreationStore.ts";

export function useComponent(componentId: string) {
  const { t } = useTranslation();

  const component = useSnapshot(
    UserCreationStore.value.components[componentId]
  );

  if (!component) {
    throw new Error(t("errorMissingComponent", { componentId: componentId }));
  }

  const componentSpecId = component.componentSpec;
  const componentSpec = useComponentSpec(componentSpecId);

  return { component, componentSpec, componentSpecId };
}
