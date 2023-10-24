import {proxy} from "valtio";

import {ProductConfiguration} from "../interfaces/ProductConfiguration.ts";
import {UserProduct} from "../interfaces/UserProduct.ts";
import {loadProductConfiguration} from "../services/ProductConfigurationLoader.ts";

export const userProductStore = proxy({
  userProduct: {
    baseComponent: "comp1",
    configuredMaterials: [],
    attachedComponents: [
      {
        component: "comp1",
        configuredMaterials: [],
        attachedComponents: [],
        mountingPoint: "mp1"
      }
    ]
  } as UserProduct
});

export const loadProductConfigurationIntoStore = async (configUrl: string) => {
  try {
    productConfigurationStore.productConfiguration = await loadProductConfiguration(configUrl);
  } catch (error) {
    if (error instanceof Error) {
      productConfigurationStore.error = error;
    }
  }
  productConfigurationStore.isLoading = false;
};

export const productConfigurationStore = proxy({
  productConfiguration: undefined as ProductConfiguration | undefined,
  isLoading: true,
  error: null as Error | null,
});
