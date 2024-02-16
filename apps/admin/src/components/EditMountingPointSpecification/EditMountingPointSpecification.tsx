import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { useSnapshot } from "valtio";

import { EditMountingPointSpecificationComponents } from "./EditMountingPointSpecificationComponents.tsx";
import { EditMountingPointSpecificationDetails } from "./EditMountingPointSpecificationDetails.tsx";
import { EditMountingPointSpecificationPositioning } from "./EditMountingPointSpecificationPositioning.tsx";
import { ComponentsStore } from "../../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../../stores/EditorValuesStore.ts";

interface EditMountingPointSpecificationProps {
  onClose: () => void;
}

export const EditMountingPointSpecification = ({
  onClose,
}: EditMountingPointSpecificationProps) => {
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

  const mountingPointId = editorValuesSnap.selectedMountingPoint;
  if (!mountingPointId) {
    return null;
  }

  const mountingPoint = componentSpec.mountingPointsSpecs[mountingPointId];
  if (!mountingPoint) {
    return null;
  }

  return (
    <div className="flex w-full select-text flex-col overflow-x-clip overflow-y-scroll pb-10">
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
    </div>
  );
};
