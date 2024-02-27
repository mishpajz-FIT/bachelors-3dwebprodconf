import { downloadableJson } from "@3dwebprodconf/shared/src/utilites/downloadableJson.ts";

import { CatalogueStore } from "../CatalogueStore.ts";

export const exportCatalogue = () => {
  downloadableJson(JSON.stringify(CatalogueStore), "catalogue");
};
