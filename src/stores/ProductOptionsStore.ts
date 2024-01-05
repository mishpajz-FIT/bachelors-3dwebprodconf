import {proxy} from "valtio";

import {Base, Component} from "../interfaces/ProductOptions.ts";
import {loadProductOptions} from "../services/ProductOptionsLoader.ts";

export const loadProductOptionsIntoStore = async (configUrl: string) => {
  ProductOptionsStore.isLoading = true;
  try {
    const productOptions = await loadProductOptions(configUrl);

    const bases = new Map<string, Base>;
    productOptions.bases.forEach(base => {
      bases.set(base.baseId, base);
    });
    ProductOptionsStore.bases = bases;

    const components = new Map<string, Component>;
    productOptions.components.forEach(component => {
      components.set(component.productId, component);
    });
    ProductOptionsStore.components = components;

  } catch (error) {
    if (error instanceof Error) {
      ProductOptionsStore.error = error;
    }
  }
  ProductOptionsStore.isLoading = false;
};

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
