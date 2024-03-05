import { ProductSpecification } from "@3dwebprodconf/shared/src/interfaces/ProductSpecification.ts";
import { ChangeEvent } from "react";

import { EditorValuesStore } from "../../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";

export const ProductComposerImport = () => {
  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result;
      if (text) {
        const json = JSON.parse(text as string) as ProductSpecification;

        //TODO: validation

        ProductStore.componentSpecs = {};
        if (json.componentSpecs) {
          ProductStore.componentSpecs = json.componentSpecs;
        }

        ProductStore.baseSpecs = {};
        if (json.baseSpecs) {
          ProductStore.baseSpecs = json.baseSpecs;
        }

        EditorValuesStore.selectedComponentSpec = undefined;
        EditorValuesStore.selectedMaterial = undefined;
        EditorValuesStore.selectedMountingPoint = undefined;
      }
    };
    reader.readAsText(file);
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
