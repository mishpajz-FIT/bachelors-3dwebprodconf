import { Suspense, useState } from "react";
import { useSnapshot } from "valtio";

import { EditComponent } from "./EditComponent/EditComponent.tsx";
import { ProductEditorLoading } from "./ProductEditorLoading.tsx";
import { SelectBase } from "./SelectBase/SelectBase.tsx";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { ProductEditorCanvas } from "../../../3d/ProductEditorCanvas.tsx";
import { Side } from "../../universal/containers/Side.tsx";

interface ProductEditorProps {
  onDone: () => void;
}

export const ProductEditor = ({ onDone }: ProductEditorProps) => {
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const [isBaseSelectionOpen, setBaseSelectionOpen] = useState(false);

  if (!productSpecsSnap.productSpecification) {
    throw new Error(`Product specification not found`);
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

        <div className="flex flex-row justify-between bg-white p-2 shadow-md dark:bg-gray-900">
          <button
            className="other-button"
            onClick={() => {
              setBaseSelectionOpen(true);
              EditorValuesStore.selectedComponentId = undefined;
            }}
          >
            Back
          </button>

          <button className="primary-button" onClick={onDone}>
            Done
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
