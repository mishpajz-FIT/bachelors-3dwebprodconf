import { Suspense, useState } from "react";
import { useSnapshot } from "valtio";

import { ProductEditorLoading } from "./ProductEditorLoading.tsx";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { UserProductStore } from "../../../../stores/UserProductStore.ts";
import { ProductEditorCanvas } from "../../../3d/ProductEditorCanvas.tsx";
import { Side } from "../../universal/containers/Side.tsx";
import { EditComponent } from "../EditComponent/EditComponent.tsx";
import { SelectBase } from "../SelectBase/SelectBase.tsx";

export const ProductEditor = () => {
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const userProductSnap = useSnapshot(UserProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const [isBaseSelectionOpen, setBaseSelectionOpen] = useState(false);

  if (!productSpecsSnap) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product!");
  }

  return (
    <div className="relative flex grow flex-col">
      <Suspense fallback={<ProductEditorLoading />}>
        <div className="relative flex grow overflow-x-hidden">
          <ProductEditorCanvas />

          <Side isOpen={editorValuesSnap.selectedComponentId !== undefined}>
            <EditComponent
              onClose={() =>
                (EditorValuesStore.selectedComponentId = undefined)
              }
            />
          </Side>
        </div>

        <div className="bg-white p-2 shadow-md dark:bg-gray-900">
          <button
            className="other-button"
            onClick={() => {
              setBaseSelectionOpen(true);
              EditorValuesStore.selectedComponentId = undefined;
            }}
          >
            Back
          </button>
        </div>

        {isBaseSelectionOpen && (
          <div className="absolute inset-0 z-[75] bg-white dark:bg-gray-900">
            <SelectBase onClose={() => setBaseSelectionOpen(false)} />
          </div>
        )}
      </Suspense>
    </div>
  );
};
