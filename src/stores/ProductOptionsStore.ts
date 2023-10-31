import {proxy} from "valtio";

import {ProductOptions} from "../interfaces/ProductOptions.ts";
import {loadProductOptions} from "../services/ProductOptionsLoader.ts";

export const loadProductOptionsIntoStore = async (configUrl: string) => {
  try {
    ProductOptionsStore.productOptions = await loadProductOptions(configUrl);
  } catch (error) {
    if (error instanceof Error) {
      ProductOptionsStore.error = error;
    }
  }
  ProductOptionsStore.isLoading = false;
};

export const ProductOptionsStore = proxy({
  productOptions: undefined as ProductOptions | undefined,
  isLoading: true,
  error: null as Error | null,
});
