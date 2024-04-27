import {
  Catalog,
  CatalogProduct,
} from "@3dwebprodconf/shared/src/schemas/Catalog.ts";

import { CatalogStore } from "../CatalogStore.ts";

export class CatalogActions {
  static clearCatalog(store: CatalogStore) {
    store.products = {};
  }
  static storeCatalog(catalog: Catalog, store: CatalogStore) {
    CatalogActions.clearCatalog(store);
    Object.assign(store, catalog);
  }

  static getProduct(productId: string, store: CatalogStore): CatalogProduct {
    const product = store.products[productId];

    if (!product) {
      throw new Error(`Product ${productId} does not exist in the catalog.`);
    }

    return product;
  }

  static removeProduct(productId: string, store: CatalogStore) {
    delete store.products[productId];
  }

  static addProduct(
    productId: string,
    product: CatalogProduct,
    store: CatalogStore
  ) {
    store.products[productId] = product;
  }

  static productExists(productId: string, store: CatalogStore): boolean {
    return Object.prototype.hasOwnProperty.call(store.products, productId);
  }
}
