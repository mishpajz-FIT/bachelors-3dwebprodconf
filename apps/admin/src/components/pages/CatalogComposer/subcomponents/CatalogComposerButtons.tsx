import { HoldButton } from "@3dwebprodconf/shared/src/components/HoldButton.tsx";
import { CatalogSchema } from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { warningToast } from "@3dwebprodconf/shared/src/toasts/warningToast.ts";
import { downloadableJson } from "@3dwebprodconf/shared/src/utilites/Exporting.ts";
import { formatZodError } from "@3dwebprodconf/shared/src/utilites/Formatting.ts";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent } from "react";
import { ZodError } from "zod";

import { CatalogActions } from "../../../../stores/actions/CatalogActions.ts";
import { CatalogStore } from "../../../../stores/CatalogStore.ts";
import { errorToast } from "../../../../toasts/errorToast.ts";
import { readCatalogFromFile } from "../../../../utilities/Importing.ts";

export const CatalogComposerButtons = () => {
  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      errorToast("File could not be loaded.");
      return;
    }

    readCatalogFromFile(file)
      .then((catalog) => {
        CatalogActions.storeCatalog(catalog, CatalogStore);
      })
      .catch((error) => {
        let message = "Catalog couldn't be imported.";

        if (error instanceof ZodError) {
          message = formatZodError(error);
        } else if (error instanceof Error) {
          message = error.message;
        }

        errorToast(message);
        event.target.value = "";
      });

    event.target.value = "";
  };

  const onExport = () => {
    try {
      const validationResult = CatalogSchema.safeParse(CatalogStore);
      if (!validationResult.success) {
        warningToast(
          `This catalog has incorrect values: ${formatZodError(validationResult.error)}`
        );
      }

      downloadableJson(JSON.stringify(CatalogStore), "catalog");
    } catch (error) {
      let message = "Catalog couldn't be exported.";

      if (error instanceof Error) {
        message = error.message;
      }

      errorToast(message);
    }
  };

  return (
    <div className="mt-auto flex flex-row items-center justify-between gap-1">
      <HoldButton
        className="other-button destructive-button-on-hold flex items-center justify-center"
        onSubmit={() => {
          CatalogActions.clearCatalog(CatalogStore);
        }}
        duration={500}
        popoverPosition={"top-start"}
        popoverOffset={6}
      >
        <TrashIcon className="size-4" />
        <span className="ml-2">Clear</span>
      </HoldButton>

      <div className="flex flex-row gap-1">
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
    </div>
  );
};
