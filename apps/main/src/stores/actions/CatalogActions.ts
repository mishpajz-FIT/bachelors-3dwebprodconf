import { Catalog } from "@3dwebprodconf/shared/src/schemas/Catalog.ts";

import { fetchCatalog } from "../../utilities/Fetching.ts";
import { CatalogStore } from "../CatalogStore.ts";

export class CatalogActions {
  static async getCatalog(
    fallbackUrl: string,
    store: typeof CatalogStore
  ): Promise<Catalog> {
    if (!store.catalog) {
      store.catalog = await fetchCatalog(fallbackUrl);
    }

    return store.catalog;
  }
}
