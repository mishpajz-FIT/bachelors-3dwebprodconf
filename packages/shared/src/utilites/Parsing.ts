import {
  ProductSpecification,
  ProductSpecificationSchema,
} from "../schemas/ProductSpecification.ts";

export function parseProductSpecification(from: unknown): ProductSpecification {
  const productSpec = ProductSpecificationSchema.parse(from);

  const componentSpecKeys = new Set(Object.keys(productSpec.componentSpecs));
  Object.values(productSpec.baseSpecs).forEach((base) => {
    if (!componentSpecKeys.has(base.component)) {
      throw new Error(`Component ${base.component} does not exist.`);
    }
  });

  Object.values(productSpec.componentSpecs).forEach((componentSpec) => {
    Object.values(componentSpec.mountingPointsSpecs).forEach(
      (mountingPointSpec) => {
        mountingPointSpec.mountableComponents.forEach((mountableComponent) => {
          if (!componentSpecKeys.has(mountableComponent)) {
            throw new Error(`Component ${mountableComponent} does not exist.`);
          }
        });
      }
    );
  });

  return productSpec;
}
