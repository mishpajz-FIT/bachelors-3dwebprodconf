import { CanvasLoading } from "@3dwebprodconf/shared/src/components/CanvasLoading.tsx";
import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { Side } from "@3dwebprodconf/shared/src/components/containers/Side.tsx";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const userCreationSnap = useSnapshot(UserCreationStore);
  const configuratorValuesSnap = useSnapshot(ConfiguratorValuesStore);

  const [isMissingPopupOpen, setMissingPopupOpen] = useState(false);
  const [isBaseSelectionOpen, setBaseSelectionOpen] = useState(
    !userCreationSnap.value.isBaseSet
  );

  const onDone = () => {
    const missingRequired = UserCreationActions.detectMissingRequired(
      UserCreationStore.value,
      ProductSpecificationStore
    );
    if (missingRequired.length !== 0) {
      setMissingPopupOpen(true);
      return;
    }

    navigate("/confirm/" + UserCreationStore.value.product);
  };

  return (
    <div className="relative flex min-h-0 shrink grow flex-col">
      <Suspense
        fallback={
          <div className="other-background size-full">
            <CanvasLoading />
          </div>
        }
      >
        <div className="relative shrink grow overflow-hidden">
          {userCreationSnap.value.isBaseSet && <ProductEditorCanvas />}

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
            {t("back")}
          </button>
          <button className="primary-button" onClick={onDone}>
            {t("done")}
          </button>
        </div>

        {(isBaseSelectionOpen || !userCreationSnap.value.isBaseSet) && (
          <div className="absolute inset-0 z-[75] bg-white dark:bg-gray-900">
            <SelectBase onClose={() => setBaseSelectionOpen(false)} />
          </div>
        )}
      </Suspense>

      <Popup
        isOpen={isMissingPopupOpen}
        onClose={() => setMissingPopupOpen(false)}
      >
        <div className="flex flex-col">
          <ContainerHeader
            title={""}
            subheader={true}
            onClose={() => setMissingPopupOpen(false)}
          />
          <p className="m-4 rounded-lg bg-[var(--error-light)] p-2 text-sm text-white dark:bg-[var(--error-dark)]">
            {t("missingRequiredComponents")}
          </p>
        </div>
      </Popup>
    </div>
  );
};

export default ProductEditor;
