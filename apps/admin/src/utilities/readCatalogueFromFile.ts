import { CatalogueSchema } from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";

import { CatalogueStore } from "../stores/CatalogueStore.ts";

export function readCatalogueFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const text = e.target?.result;
        if (text) {
          const catalogue = CatalogueSchema.parse(JSON.parse(text as string));

          CatalogueStore.products = {};
          Object.assign(CatalogueStore, catalogue);
          resolve();
        } else {
          reject(new Error("No text found in file."));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
}
