import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { proxy } from "valtio";

export type ProductStore = ProductSpecification;

export const ProductStore = proxy<ProductStore>({
  componentSpecs: {},
  baseSpecs: {},
});
