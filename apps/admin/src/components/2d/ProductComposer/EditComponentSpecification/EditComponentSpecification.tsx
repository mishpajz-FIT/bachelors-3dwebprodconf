import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { HoldButton } from "@3dwebprodconf/shared/src/components/HoldButton.tsx";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useSnapshot } from "valtio";

import { EditComponentSpecificationDetails } from "./subcomponents/EditComponentSpecificationDetails.tsx";
import { EditComponentSpecificationMaterials } from "./subcomponents/EditComponentSpecificationMaterials.tsx";
import { EditComponentSpecificationMountingPoints } from "./subcomponents/EditComponentSpecificationMountingPoints.tsx";
import { EditComponentSpecificationPositioning } from "./subcomponents/EditComponentSpecificationPositioning.tsx";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";

interface EditComponentSpecificationProps {
  onClose: () => void;
}

export const EditComponentSpecification = ({
  onClose,
}: EditComponentSpecificationProps) => {
  const productSnap = useSnapshot(ProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentSpecId = editorValuesSnap.selectedComponentSpec;
  if (!componentSpecId) {
    return null;
  }

  const componentSpec = productSnap.componentSpecs[componentSpecId];
  if (!componentSpec) {
    return null;
  }

  const remove = () => {
    Object.keys(ProductStore.baseSpecs).forEach((baseSpecId) => {
      if (ProductStore.baseSpecs[baseSpecId].component === componentSpecId) {
        delete ProductStore.baseSpecs[baseSpecId];
      }
    });

    Object.keys(ProductStore.componentSpecs).forEach((iterComponentSpecId) => {
      const iterComponentSpec =
        ProductStore.componentSpecs[iterComponentSpecId];
      Object.keys(iterComponentSpec.mountingPointsSpecs).forEach(
        (iterMountingPointId) => {
          const iterMountPoint =
            iterComponentSpec.mountingPointsSpecs[iterMountingPointId];
          iterMountPoint.mountableComponents =
            iterMountPoint.mountableComponents.filter(
              (component) => component !== componentSpecId
            );
        }
      );
    });

    delete ProductStore.componentSpecs[componentSpecId];
    onClose();
  };

  return (
    <div className="flex w-full select-text flex-col overflow-x-clip overflow-y-scroll">
      <ContainerHeader
        title={"Edit component specification"}
        onClose={onClose}
        subheader={true}
      />
      <h2 className="w-full shrink-0 truncate p-4 font-mono text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-300">
        {componentSpecId}
      </h2>
      <EditComponentSpecificationDetails />
      <EditComponentSpecificationPositioning />
      <EditComponentSpecificationMountingPoints />
      <EditComponentSpecificationMaterials />

      <div className="mt-auto flex items-center justify-center gap-2 p-4">
        <HoldButton
          className="other-button destructive-button-on-hold mt-8 flex w-full items-center justify-center"
          onSubmit={remove}
          duration={650}
          popoverPosition={"top-end"}
          popoverOffset={6}
        >
          <TrashIcon className="size-4" />
          <span className="ml-2">Remove component specification</span>
        </HoldButton>
      </div>
    </div>
  );
};
