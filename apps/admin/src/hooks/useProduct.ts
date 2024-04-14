import { CatalogProduct } from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { useSnapshot } from "valtio";

import { CatalogStore } from "../stores/CatalogStore.ts";

export function useProduct(productId: string): CatalogProduct {
  const catalogSnap = useSnapshot(CatalogStore);

  const product = catalogSnap.products[productId];
  if (!product) {
    throw new Error(`Product ${productId} does not exist.`);
  }

  return product;
}
