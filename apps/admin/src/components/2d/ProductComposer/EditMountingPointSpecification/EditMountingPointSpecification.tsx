import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { HoldButton } from "@3dwebprodconf/shared/src/components/HoldButton.tsx";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useSnapshot } from "valtio";

import { EditMountingPointSpecificationComponents } from "./subcomponents/EditMountingPointSpecificationComponents.tsx";
import { EditMountingPointSpecificationDetails } from "./subcomponents/EditMountingPointSpecificationDetails.tsx";
import { EditMountingPointSpecificationPositioning } from "./subcomponents/EditMountingPointSpecificationPositioning.tsx";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";

interface EditMountingPointSpecificationProps {
  onClose: () => void;
}

export const EditMountingPointSpecification = ({
  onClose,
}: EditMountingPointSpecificationProps) => {
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

  const mountingPointId = editorValuesSnap.selectedMountingPoint;
  if (!mountingPointId) {
    return null;
  }

  const mountingPoint = componentSpec.mountingPointsSpecs[mountingPointId];
  if (!mountingPoint) {
    return null;
  }

  const remove = () => {
    delete ProductStore.componentSpecs[componentSpecId].mountingPointsSpecs[
      mountingPointId
    ];
    onClose();
  };

  return (
    <div className="flex w-full select-text flex-col overflow-x-clip overflow-y-scroll">
      <ContainerHeader
        title={"Edit mounting point"}
        onClose={onClose}
        subheader={true}
      />
      <h2 className="w-full shrink-0 truncate p-4 font-mono text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-300">
        {mountingPointId}
      </h2>
      <EditMountingPointSpecificationDetails />
      <EditMountingPointSpecificationPositioning />
      <EditMountingPointSpecificationComponents />

      <div className="mt-auto flex items-center justify-center gap-2 p-4">
        <HoldButton
          className="other-button destructive-button-on-hold mt-8 flex w-full items-center justify-center"
          onSubmit={remove}
          duration={650}
          popoverPosition={"top-end"}
          popoverOffset={6}
        >
          <TrashIcon className="size-4" />
          <span className="ml-2">Remove mounting point</span>
        </HoldButton>
      </div>
    </div>
  );
};
