import { Catalogue } from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";

import { fetchCatalogue } from "../../utilities/Fetching.ts";
import { CatalogueStore } from "../CatalogueStore.ts";

export class CatalogueActions {
  static async getCatalogue(
    fallbackUrl: string,
    store: typeof CatalogueStore
  ): Promise<Catalogue> {
    if (!store.catalogue) {
      store.catalogue = await fetchCatalogue(fallbackUrl);
    }

    return store.catalogue;
  }
}
