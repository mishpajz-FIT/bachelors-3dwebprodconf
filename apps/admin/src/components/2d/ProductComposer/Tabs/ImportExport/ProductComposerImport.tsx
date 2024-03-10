import { ChangeEvent } from "react";

import { EditorValuesStore } from "../../../../../stores/EditorValuesStore.ts";
import { readProductSpecificationFromFile } from "../../../../../utilities/readProductSpecificationFromFile.ts";

export const ProductComposerImport = () => {
  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    readProductSpecificationFromFile(file);

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
