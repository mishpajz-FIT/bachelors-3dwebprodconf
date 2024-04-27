import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { proxy } from "valtio";

export type ProductSpecificationStore = ProductSpecification;

export const ProductSpecificationStore = proxy<ProductSpecificationStore>({
  baseSpecs: {},
  componentSpecs: {},
});
