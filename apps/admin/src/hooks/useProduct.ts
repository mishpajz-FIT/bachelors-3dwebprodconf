import { CatalogueProduct } from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";
import { useSnapshot } from "valtio";

import { CatalogueStore } from "../stores/CatalogueStore.ts";

export function useProduct(productId: string): CatalogueProduct {
  const catalogueSnap = useSnapshot(CatalogueStore);

  const product = catalogueSnap.products[productId];
  if (!product) {
    throw new Error(`Product ${productId} does not exist.`);
  }

  return product;
}
