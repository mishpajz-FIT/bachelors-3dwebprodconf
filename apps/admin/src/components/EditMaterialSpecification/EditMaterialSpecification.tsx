import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { useSnapshot } from "valtio";

import { EditMaterialSpecificationColors } from "./EditMaterialSpecificationColors.tsx";
import { EditMaterialSpecificationDetails } from "./EditMaterialSpecificationDetails.tsx";
import { EditMaterialSpecificationModels } from "./EditMaterialSpecificationModels.tsx";
import { ComponentsStore } from "../../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../../stores/EditorValuesStore.ts";

interface EditMaterialSpecificationProps {
  onClose: () => void;
}

export const EditMaterialSpecification = ({
  onClose,
}: EditMaterialSpecificationProps) => {
  const componentsSnap = useSnapshot(ComponentsStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentSpecId = editorValuesSnap.selectedComponentSpec;
  if (!componentSpecId) {
    return null;
  }

  const componentSpec =
    componentsSnap.components[editorValuesSnap.selectedComponentSpec];
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

  return (
    <div className="flex w-full select-text flex-col overflow-x-clip overflow-y-scroll pb-10">
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
    </div>
  );
};
