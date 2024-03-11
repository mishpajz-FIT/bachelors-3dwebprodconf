import { formatZodError } from "@3dwebprodconf/shared/src/utilites/Formatting.ts";
import { ChangeEvent } from "react";
import { ZodError } from "zod";

import { ProductActions } from "../../../../../stores/actions/ProductActions.ts";
import { EditorValuesStore } from "../../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";
import { errorToast } from "../../../../../toasts/errorToast.ts";
import { readProductSpecificationFromFile } from "../../../../../utilities/Importing.ts";

export const ProductComposerTabsImportButton = () => {
  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      errorToast("File could not be loaded.");
      return;
    }

    readProductSpecificationFromFile(file)
      .then((productSpecificaiton) => {
        ProductActions.storeProductSpecification(
          productSpecificaiton,
          ProductStore
        );
      })
      .catch((error) => {
        let message = "Product specification couldn't be imported.";

        if (error instanceof ZodError) {
          message = formatZodError(error);
        } else if (error instanceof Error) {
          message = error.message;
        }

        errorToast(message);
      });

    EditorValuesStore.selectedComponentSpec = undefined;
    EditorValuesStore.selectedMaterial = undefined;
    EditorValuesStore.selectedMountingPoint = undefined;
  };

  return (
    <>
      <input
        type="file"
        id="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileSelection}
      />
      <label htmlFor="file" className="secondary-button">
        Import
      </label>
    </>
  );
};
