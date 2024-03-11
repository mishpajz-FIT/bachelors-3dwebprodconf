import { CatalogueSchema } from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";
import { downloadableJson } from "@3dwebprodconf/shared/src/utilites/Exporting.ts";
import { formatZodError } from "@3dwebprodconf/shared/src/utilites/Formatting.ts";
import { ChangeEvent } from "react";
import { ZodError } from "zod";

import { CatalogueActions } from "../../../../stores/actions/CatalogueActions.ts";
import { CatalogueStore } from "../../../../stores/CatalogueStore.ts";
import { errorToast } from "../../../../toasts/errorToast.ts";
import { readCatalogueFromFile } from "../../../../utilities/Importing.ts";

export const CatalogueComposerButtons = () => {
  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      errorToast("File could not be loaded.");
      return;
    }

    readCatalogueFromFile(file)
      .then((catalogue) => {
        CatalogueActions.storeCatalogue(catalogue, CatalogueStore);
      })
      .catch((error) => {
        let message = "Catalogue couldn't be imported.";

        if (error instanceof ZodError) {
          message = formatZodError(error);
        } else if (error instanceof Error) {
          message = error.message;
        }

        errorToast(message);
      });
  };

  const onExport = () => {
    try {
      CatalogueSchema.parse(CatalogueStore);
      downloadableJson(JSON.stringify(CatalogueStore), "catalogue");
    } catch (error) {
      let message = "Catalogue couldn't be exported.";

      if (error instanceof Error) {
        message = error.message;
      }

      errorToast(message);
    }
  };

  return (
    <div className="mt-auto flex flex-row items-center justify-end gap-1">
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
      <button className="primary-button" onClick={onExport}>
        Export
      </button>
    </div>
  );
};
