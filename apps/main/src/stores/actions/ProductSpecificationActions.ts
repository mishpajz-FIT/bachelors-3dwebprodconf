import { ProductSpecificationStore } from "../ProductSpecificationStore.ts";
import {
  ComponentSpecification,
  MaterialSpecification,
  ProductSpecification,
} from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";

export class ProductSpecificationActions {
  private static get<T>(id: string, from: Record<string, T>, name: string): T {
    const element = from[id];
    if (!element) {
      throw new Error(`${name} ${id} does not exist.`);
    }
    return element;
  }

  static getComponentSpec(
    componentSpecId: string,
    store: typeof ProductSpecificationStore
  ) {
    return this.get(
      componentSpecId,
      store.componentSpecs,
      "Component specification"
    );
  }

  static getMountingPointSpec(
    componentSpec: ComponentSpecification,
    mountingPointSpecId: string
  ) {
    return this.get(
      mountingPointSpecId,
      componentSpec.mountingPointsSpecs,
      "Mounting point specification"
    );
  }

  static getMaterialSpec(
    componentSpec: ComponentSpecification,
    materialSpecId: string
  ) {
    return this.get(
      materialSpecId,
      componentSpec.materialSpecs,
      "Material specification"
    );
  }

  static getColorSpec(
    materialSpec: MaterialSpecification,
    colorSpecId: string
  ) {
    return this.get(
      colorSpecId,
      materialSpec.colorVariationsSpecs,
      "Color specification"
    );
  }

  static storeProductSpecification(
    productSpec: ProductSpecification,
    store: typeof ProductSpecificationStore
  ) {
    store.componentSpecs = {};
    store.baseSpecs = {};
    Object.assign(store, productSpec);
  }
}
