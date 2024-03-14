import {
  MaterialSpecification,
  ProductSpecification,
} from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { GenericProductSpecificationActions } from "@3dwebprodconf/shared/src/stores/actions/GenericProductSpecificationActions.ts";

import { ProductSpecificationStore } from "../ProductSpecificationStore.ts";

export class ProductSpecificationActions extends GenericProductSpecificationActions {
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

  static colorSpecificationWithLowestSortIndex(
    materialSpec: MaterialSpecification
  ) {
    const colorVariations = Object.entries(materialSpec.colorVariationsSpecs);

    if (colorVariations.length === 0) {
      return undefined;
    }

    return colorVariations.reduce((lowest, current) => {
      return current[1].sortIndex < lowest[1].sortIndex ? current : lowest;
    }, colorVariations[0])[0];
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
