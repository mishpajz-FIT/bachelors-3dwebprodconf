import {ProductSpecification} from "../../interfaces/ProductSpecification.ts";
import {ProductSpecificationStore} from "../ProductSpecificationStore.ts";

export const storeProductSpecification = async (
  load: () => Promise<ProductSpecification>) => {
  ProductSpecificationStore.isLoading = true;
  try {
    const productSpecification = await load();

    console.log(productSpecification);

    ProductSpecificationStore.baseSpecs = productSpecification.baseSpecs;
    ProductSpecificationStore.componentSpecs = productSpecification.componentSpecs;

  } catch (error) {
    if (error instanceof Error) {
      ProductSpecificationStore.error = error;
    }
  }
  ProductSpecificationStore.isLoading = false;
};
