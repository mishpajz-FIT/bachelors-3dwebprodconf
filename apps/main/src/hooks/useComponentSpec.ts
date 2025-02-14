import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { ProductSpecificationStore } from "../stores/ProductSpecificationStore.ts";

export function useComponentSpec(componentSpecId: string) {
  const { t } = useTranslation();

  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];
  if (!componentSpec) {
    throw new Error(
      t("errorMissingComponentSpec", { componentSpecId: componentSpecId })
    );
  }

  return componentSpec;
}
