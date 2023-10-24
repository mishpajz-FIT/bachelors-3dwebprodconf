import {proxy} from "valtio";

import {ProductConfiguration} from "../interfaces/ProductConfiguration.ts";
import {loadProductConfiguration} from "../services/ProductConfigurationLoader.ts";

export const loadProductConfigurationIntoStore = async (configUrl: string) => {
  try {
    ProductConfigurationStore.productConfiguration = await loadProductConfiguration(configUrl);
  } catch (error) {
    if (error instanceof Error) {
      ProductConfigurationStore.error = error;
    }
  }
  ProductConfigurationStore.isLoading = false;
};

export const ProductConfigurationStore = proxy({
  productConfiguration: undefined as ProductConfiguration | undefined,
  isLoading: true,
  error: null as Error | null,
});
