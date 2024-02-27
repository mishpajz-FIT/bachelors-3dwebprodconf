import { ErrorBoundary } from "react-error-boundary";
import { useSnapshot } from "valtio";

import { EditMaterialSpecificationColors } from "./subcomponents/EditMaterialSpecificationColors.tsx";
import { EditMaterialSpecificationDetails } from "./subcomponents/EditMaterialSpecificationDetails.tsx";
import { EditMaterialSpecificationModels } from "./subcomponents/EditMaterialSpecificationModels.tsx";
import { EditorValuesStore } from "../../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";
import { EditContent } from "../EditContent.tsx";

interface EditMaterialSpecificationProps {
  onClose: () => void;
}

export const EditMaterialSpecification = ({
  onClose,
}: EditMaterialSpecificationProps) => {
  const productSnap = useSnapshot(ProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentSpecId = editorValuesSnap.selectedComponentSpec;
  if (!componentSpecId) {
    return null;
  }

  const componentSpec =
    productSnap.componentSpecs[editorValuesSnap.selectedComponentSpec];
  if (!componentSpec) {
    return null;
  }

  const materialId = editorValuesSnap.selectedMaterial;
  if (!materialId) {
    return null;
  }

  const material = componentSpec.materialSpecs[materialId];
  if (!material) {
    return null;
  }

  const remove = () => {
    delete ProductStore.componentSpecs[componentSpecId].materialSpecs[
      materialId
    ];
    onClose();
  };

  return (
    <EditContent
      panelTitle={"Edit material"}
      itemName={materialId}
      removeButton={"Remove material"}
      onClose={onClose}
      onRemove={remove}
    >
      <EditMaterialSpecificationDetails />
      <ErrorBoundary
        key={"materials" + componentSpec.modelUrl}
        fallback={
          <div>
            <h3 className="section-heading">Included Model Materials</h3>
            <div className="mx-4 rounded-lg bg-[var(--error-light)] bg-rose-500 p-2 text-sm text-white dark:bg-[var(--error-dark)]">
              Model materials of component could not be loaded.
            </div>
          </div>
        }
      >
        <EditMaterialSpecificationModels />
      </ErrorBoundary>
      <EditMaterialSpecificationColors />
    </EditContent>
  );
};
