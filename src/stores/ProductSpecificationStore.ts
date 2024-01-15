import { proxy } from "valtio";

import { ProductSpecification } from "../interfaces/ProductSpecification.ts";

interface ProductSpecificationStoreInfo {
  isLoading: boolean;
  error?: Error;
}

export const ProductSpecificationStore = proxy<
  ProductSpecification & ProductSpecificationStoreInfo
>({
  baseSpecs: {},
  componentSpecs: {},
  isLoading: true,
  error: undefined,
});
