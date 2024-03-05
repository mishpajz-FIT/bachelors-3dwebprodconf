import { ProductSpecification } from "@3dwebprodconf/shared/src/interfaces/ProductSpecification.ts";

import { ProductSpecificationStore } from "../ProductSpecificationStore.ts";

export async function fetchProductSpecification(
  url: string
): Promise<ProductSpecification> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  // TODO: Validate data

  return (await response.json()) as ProductSpecification;
}

export function validateComponentSpec(
  componentSpecId: string,
  store: typeof ProductSpecificationStore
) {
  const componentSpec = store.componentSpecs[componentSpecId];
  if (!componentSpec) {
    throw new Error(`Specification ${componentSpecId} component do not exist.`);
  }
  return componentSpec;
}

export function validateMountingPointSpec(
  componentSpecId: string,
  mountingPointSpecId: string,
  store: typeof ProductSpecificationStore
) {
  const componentSpec = validateComponentSpec(componentSpecId, store);

  const mountingPointSpec =
    componentSpec.mountingPointsSpecs[mountingPointSpecId];
  if (!mountingPointSpec) {
    throw new Error(
      `Mounting point ${mountingPointSpecId} on ${componentSpecId} does not exist.`
    );
  }

  return mountingPointSpec;
}

export function validateMaterialSpec(
  componentSpecId: string,
  materialSpecId: string,
  store: typeof ProductSpecificationStore
) {
  const componentSpec = validateComponentSpec(componentSpecId, store);

  const materialSpec = componentSpec.materialSpecs[materialSpecId];
  if (!materialSpec) {
    throw new Error(
      `Material ${materialSpecId} on ${componentSpecId} does not exist.`
    );
  }

  return materialSpec;
}

export function validateColorSpec(
  componentSpecId: string,
  materialSpecId: string,
  colorSpecId: string,
  store: typeof ProductSpecificationStore
) {
  const materialSpec = validateMaterialSpec(
    componentSpecId,
    materialSpecId,
    store
  );

  const colorVariationSpec = materialSpec.colorVariationsSpecs[colorSpecId];
  if (!colorVariationSpec) {
    throw new Error(
      `Color variation ${componentSpecId} on material ${materialSpecId} on ${componentSpecId} does not exist.`
    );
  }

  return colorVariationSpec;
}
