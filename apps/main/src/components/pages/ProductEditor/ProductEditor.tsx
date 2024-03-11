import { CanvasLoading } from "@3dwebprodconf/shared/src/components/CanvasLoading.tsx";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { Side } from "@3dwebprodconf/shared/src/components/containers/Side.tsx";
import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { EditComponent } from "./EditComponent/EditComponent.tsx";
import { SelectBase } from "./SelectBase/SelectBase.tsx";
import { UserCreationActions } from "../../../stores/actions/UserCreationActions.ts";
import { ConfiguratorValuesStore } from "../../../stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";

const ProductEditorCanvas = lazy(
  () => import("../../3d/ProductEditorCanvas.tsx")
);

const ProductEditor = () => {
  const navigate = useNavigate();

  const userCreationSnap = useSnapshot(UserCreationStore);
  const configuratorValuesSnap = useSnapshot(ConfiguratorValuesStore);

  const [isMissingPopupOpen, setMissingPopupOpen] = useState(false);
  const [isBaseSelectionOpen, setBaseSelectionOpen] = useState(
    !userCreationSnap.isBaseSet
  );

  const onDone = () => {
    const missingRequired = UserCreationActions.detectMissingRequired(
      UserCreationStore,
      ProductSpecificationStore
    );
    if (missingRequired.length !== 0) {
      setMissingPopupOpen(true);
      return;
    }

    navigate("/" + ConfiguratorValuesStore.currentProductId + "/confirm");
  };

  return (
    <div className="relative flex grow flex-col">
      <Suspense
        fallback={
          <div className="other-background size-full">
            <CanvasLoading />
          </div>
        }
      >
        <div className="relative flex grow overflow-x-hidden">
          {userCreationSnap.isBaseSet && <ProductEditorCanvas />}

          <Side
            isOpen={configuratorValuesSnap.selectedComponentId !== undefined}
          >
            <EditComponent
              onClose={() =>
                (ConfiguratorValuesStore.selectedComponentId = undefined)
              }
            />
          </Side>
        </div>

        <div className="other-background flex flex-row justify-between p-2 shadow-md">
          <button
            className="other-button"
            onClick={() => {
              setBaseSelectionOpen(true);
              ConfiguratorValuesStore.selectedComponentId = undefined;
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

      <Popup
        isOpen={isMissingPopupOpen}
        onClose={() => setMissingPopupOpen(false)}
      >
        <p className="m-4 rounded-lg bg-[var(--error-light)] p-2 text-sm text-white dark:bg-[var(--error-dark)]">
          Missing required components needed to complete configuration.
        </p>
      </Popup>
    </div>
  );
};

export default ProductEditor;
