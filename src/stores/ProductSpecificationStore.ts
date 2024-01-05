import {proxy} from "valtio";

import {BaseSpecification, ComponentSpecification} from "../interfaces/ProductSpecification.ts";

interface ProductSpecificationStore {
  componentSpecs: Map<string, ComponentSpecification>;
  baseSpecs: Map<string, BaseSpecification>;

  isLoading: boolean;
  error?: Error;
}

export const ProductSpecificationStore = proxy<ProductSpecificationStore>({
  componentSpecs: new Map<string, ComponentSpecification>(),
  baseSpecs: new Map<string, BaseSpecification>(),
  isLoading: true,
  error: undefined,
});
