import { parseProductSpecification } from "@3dwebprodconf/shared/src/utilites/parseProductSpecification.ts";

import { ProductStore } from "../stores/ProductStore.ts";

export function readProductSpecificationFromFile(file: File) {
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const text = e.target?.result;
    if (text) {
      const productSpecs = parseProductSpecification(
        JSON.parse(text as string)
      );

      ProductStore.componentSpecs = {};
      ProductStore.baseSpecs = {};
      Object.assign(ProductStore, productSpecs);
    }
  };
  reader.readAsText(file);
}
