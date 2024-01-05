import {Base, Component, ProductOptions} from "../../interfaces/ProductOptions.ts";
import {ProductOptionsStore} from "../ProductOptionsStore.ts";

export const storeProductOptions = async (
  load: () => Promise<ProductOptions>) => {
  ProductOptionsStore.isLoading = true;
  try {
    const productOptions = await load();

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
