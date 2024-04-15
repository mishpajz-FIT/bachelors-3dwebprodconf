import { t } from "i18next";

import {
  ProductSpecification,
  ProductSpecificationSchema,
} from "../schemas/ProductSpecification.ts";
import { GenericProductSpecificationActions } from "../stores/actions/GenericProductSpecificationActions.ts";

export function parseProductSpecification(from: unknown): ProductSpecification {
  const productSpec = ProductSpecificationSchema.parse(from);

  const componentSpecKeys = new Set(Object.keys(productSpec.componentSpecs));
  Object.values(productSpec.baseSpecs).forEach((componentSpecId) => {
    if (!componentSpecKeys.has(componentSpecId)) {
      throw new Error(
        t("errorMissingComponentSpec", { componentSpecId: componentSpecId })
      );
    }
  });

  const missingMountingPoints =
    GenericProductSpecificationActions.validateMountingPoints(
      productSpec.componentSpecs
    );
  if (Object.keys(missingMountingPoints).length !== 0) {
    let message = t("missingComponentsInMountingPoints");
    const componentsAndMountingPoints = Object.entries(
      missingMountingPoints
    ).map(([component, mountingPoints]) => {
      return `${component}: ${mountingPoints.join(", ")}`;
    });
    message += componentsAndMountingPoints.join("; ") + ";";

    throw new Error(message);
  }

  const missingColors = GenericProductSpecificationActions.validateMaterials(
    productSpec.componentSpecs
  );
  if (Object.keys(missingColors).length !== 0) {
    let message = t("missingColorsInMaterials");
    const componentsAndMaterials = Object.entries(missingColors).map(
      ([component, materials]) => {
        return `${component}: ${materials.join(", ")}`;
      }
    );
    message += componentsAndMaterials.join("; ") + ";";

    throw new Error(message);
  }

  return productSpec;
}
