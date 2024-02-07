import { proxy } from "valtio";

import { ProductSpecification } from "../interfaces/ProductSpecification.ts";

export const ProductSpecificationStore = proxy<ProductSpecification>({
  baseSpecs: {},
  componentSpecs: {},
});
