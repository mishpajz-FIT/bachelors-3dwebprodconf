import { parseProductSpecification } from "@3dwebprodconf/shared/src/utilites/parseProductSpecification.ts";

import { ProductStore } from "../stores/ProductStore.ts";

export function readProductSpecificationFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const text = e.target?.result;
        if (text) {
          const productSpecs = parseProductSpecification(
            JSON.parse(text as string)
          );

          ProductStore.componentSpecs = {};
          ProductStore.baseSpecs = {};
          Object.assign(ProductStore, productSpecs);
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
