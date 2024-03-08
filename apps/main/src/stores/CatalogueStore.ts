import { Catalogue } from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";
import { proxy } from "valtio";

interface CatalogueStore {
  catalogue: undefined | Catalogue;
}

export const CatalogueStore = proxy<CatalogueStore>({
  catalogue: undefined,
});
