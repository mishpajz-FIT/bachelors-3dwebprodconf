import { downloadableJson } from "packages/shared/src/utilites/Exporting.ts";

import { CatalogueStore } from "../CatalogueStore.ts";

export function exportCatalogue() {
  downloadableJson(JSON.stringify(CatalogueStore), "catalogue");
}
