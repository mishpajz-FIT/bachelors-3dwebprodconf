import {proxy} from "valtio";

import {Base, Component} from "../interfaces/ProductOptions.ts";

interface ProductOptionsStore {
  components: Map<string, Component>;
  bases: Map<string, Base>;
  isLoading: boolean;
  error?: Error;
}

export const ProductOptionsStore = proxy<ProductOptionsStore>({
  components: new Map<string, Component>(),
  bases: new Map<string, Base>(),
  isLoading: true,
  error: undefined,
});
