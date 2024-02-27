import { ProductSpecification } from "@3dwebprodconf/shared/src/interfaces/ProductSpecification.ts";
import { proxy } from "valtio";

export const ProductStore = proxy<ProductSpecification>({
  componentSpecs: {},
  baseSpecs: {},
});
