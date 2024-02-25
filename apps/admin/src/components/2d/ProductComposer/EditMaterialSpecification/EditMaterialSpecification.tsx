import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { HoldButton } from "@3dwebprodconf/shared/src/components/HoldButton.tsx";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useSnapshot } from "valtio";

import { EditMaterialSpecificationColors } from "./subcomponents/EditMaterialSpecificationColors.tsx";
import { EditMaterialSpecificationDetails } from "./subcomponents/EditMaterialSpecificationDetails.tsx";
import { EditMaterialSpecificationModels } from "./subcomponents/EditMaterialSpecificationModels.tsx";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";

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
    <div className="flex w-full select-text flex-col overflow-x-clip overflow-y-scroll">
      <ContainerHeader
        title={"Edit material"}
        onClose={onClose}
        subheader={true}
      />
      <h2 className="w-full shrink-0 truncate p-4 font-mono text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-300">
        {materialId}
      </h2>
      <EditMaterialSpecificationDetails />
      <EditMaterialSpecificationModels />
      <EditMaterialSpecificationColors />

      <div className="mt-auto flex items-center justify-center gap-2 p-4">
        <HoldButton
          className="other-button destructive-button-on-hold mt-8 flex w-full items-center justify-center"
          onSubmit={remove}
          duration={650}
          popoverPosition={"top-end"}
          popoverOffset={6}
        >
          <TrashIcon className="size-4" />
          <span className="ml-2">Remove material</span>
        </HoldButton>
      </div>
    </div>
  );
};
