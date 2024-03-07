import { downloadableJson } from "@3dwebprodconf/shared/src/utilites/downloadableJson.ts";

import { CatalogueStore } from "../CatalogueStore.ts";

export function exportCatalogue() {
  downloadableJson(JSON.stringify(CatalogueStore), "catalogue");
}
