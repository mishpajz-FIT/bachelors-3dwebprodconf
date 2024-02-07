import { Side } from "@3dwebprodconf/shared/src/components/containers/Side.tsx";
import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { EditComponent } from "./EditComponent/EditComponent.tsx";
import { ProductEditorLoading } from "./ProductEditorLoading.tsx";
import { SelectBase } from "./SelectBase/SelectBase.tsx";
import { EditorValuesStore } from "../../../stores/EditorValuesStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";

const ProductEditorCanvas = lazy(
  () => import("../../3d/ProductEditorCanvas.tsx")
);

const ProductEditor = () => {
  const navigate = useNavigate();

  const userCreationSnap = useSnapshot(UserCreationStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const [isBaseSelectionOpen, setBaseSelectionOpen] = useState(
    !userCreationSnap.isBaseSet
  );

  return (
    <div className="relative flex grow flex-col">
      <Suspense fallback={<ProductEditorLoading />}>
        <div className="relative flex grow overflow-x-hidden">
          {userCreationSnap.isBaseSet && <ProductEditorCanvas />}

          <Side isOpen={editorValuesSnap.selectedComponentId !== undefined}>
            <EditComponent
              onClose={() =>
                (EditorValuesStore.selectedComponentId = undefined)
              }
            />
          </Side>
        </div>

        <div className="other-background flex flex-row justify-between p-2 shadow-md">
          <button
            className="other-button"
            onClick={() => {
              setBaseSelectionOpen(true);
              EditorValuesStore.selectedComponentId = undefined;
            }}
          >
            Back
          </button>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/" + EditorValuesStore.currentProductId + "/confirm")
            }
          >
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

export default ProductEditor;
