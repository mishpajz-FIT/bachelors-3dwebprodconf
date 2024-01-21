import { proxy } from "valtio";

import { ProductSpecification } from "../interfaces/ProductSpecification.ts";

export const ProductSpecificationStore = proxy({
  productSpecification: undefined as Promise<ProductSpecification> | undefined,
});
