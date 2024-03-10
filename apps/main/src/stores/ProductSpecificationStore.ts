import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { proxy } from "valtio";

export const ProductSpecificationStore = proxy<ProductSpecification>({
  baseSpecs: {},
  componentSpecs: {},
});
