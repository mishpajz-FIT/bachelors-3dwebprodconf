import { useSnapshot } from "valtio";

import { ProductSpecificationStore } from "../stores/ProductSpecificationStore.ts";

export function useComponentSpec(componentSpecId: string) {
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];
  if (!componentSpec) {
    throw new Error(`Component specification ${componentSpecId} not found`);
  }

  return componentSpec;
}
