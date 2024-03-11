import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
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

  static storeProductSpecification(
    productSpec: ProductSpecification,
    store: typeof ProductSpecificationStore
  ) {
    store.componentSpecs = {};
    store.baseSpecs = {};
    Object.assign(store, productSpec);
  }
}
