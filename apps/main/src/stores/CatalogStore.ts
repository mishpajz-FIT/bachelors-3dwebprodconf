import { Catalog } from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { proxy } from "valtio";

interface CatalogStore {
  catalog: undefined | Catalog;
}

export const CatalogStore = proxy<CatalogStore>({
  catalog: undefined,
});
