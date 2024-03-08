import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { proxy } from "valtio";

export const ProductStore = proxy<ProductSpecification>({
  componentSpecs: {},
  baseSpecs: {},
});
