import {
  BaseSpecification,
  ComponentSpecification,
  ProductSpecification
} from "../../interfaces/ProductSpecification.ts";
import {ProductSpecificationStore} from "../ProductSpecificationStore.ts";

export const storeProductSpecification = async (
  load: () => Promise<ProductSpecification>) => {
  ProductSpecificationStore.isLoading = true;
  try {
    const productSpecification = await load();

    console.log(productSpecification);
    const bases = new Map<string, BaseSpecification>;
    productSpecification.baseSpecs.forEach(base => {
      bases.set(base.baseSpecId, base);
    });
    ProductSpecificationStore.baseSpecs = bases;

    const components = new Map<string, ComponentSpecification>;
    productSpecification.componentSpecs.forEach(component => {
      components.set(component.componentSpecId, component);
    });
    ProductSpecificationStore.componentSpecs = components;

  } catch (error) {
    if (error instanceof Error) {
      ProductSpecificationStore.error = error;
    }
  }
  ProductSpecificationStore.isLoading = false;
};
