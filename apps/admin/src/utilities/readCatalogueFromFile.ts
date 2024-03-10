import { CatalogueSchema } from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";

import { CatalogueStore } from "../stores/CatalogueStore.ts";

export function readCatalogueFromFile(file: File) {
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const text = e.target?.result;
    if (text) {
      const catalogue = CatalogueSchema.parse(JSON.parse(text as string));

      CatalogueStore.products = {};
      Object.assign(CatalogueStore, catalogue);
    }
  };
  reader.readAsText(file);
}
