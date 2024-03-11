import {
  Catalogue,
  CatalogueProduct,
} from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";

import { CatalogueStore } from "../CatalogueStore.ts";

export class CatalogueActions {
  static storeCatalogue(catalogue: Catalogue, store: typeof CatalogueStore) {
    store.products = {};
    Object.assign(store, catalogue);
  }

  static getProduct(
    productId: string,
    store: typeof CatalogueStore
  ): CatalogueProduct {
    const product = store.products[productId];

    if (!product) {
      throw new Error(`Product ${productId} does not exist in the catalogue.`);
    }

    return product;
  }

  static removeProduct(productId: string, store: typeof CatalogueStore) {
    delete store.products[productId];
  }

  static addProduct(
    productId: string,
    product: CatalogueProduct,
    store: typeof CatalogueStore
  ) {
    store.products[productId] = product;
  }

  static productExists(
    productId: string,
    store: typeof CatalogueStore
  ): boolean {
    return Object.prototype.hasOwnProperty.call(store.products, productId);
  }
}
