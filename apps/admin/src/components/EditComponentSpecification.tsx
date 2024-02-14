import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { useSnapshot } from "valtio";

import { EditComponentSpecificationDetails } from "./EditComponentSpecificationDetails.tsx";
import { EditComponentSpecificationPositioning } from "./EditComponentSpecificationPositioning.tsx";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

interface EditComponentSpecificationProps {
  onClose: () => void;
}

export const EditComponentSpecification = ({
  onClose,
}: EditComponentSpecificationProps) => {
  const componentsSnap = useSnapshot(ComponentsStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentSpecId = editorValuesSnap.selectedComponentSpec;
  if (!componentSpecId) {
    return null;
  }

  const component =
    componentsSnap.components[editorValuesSnap.selectedComponentSpec];
  if (!component) {
    return null;
  }

  return (
    <div className="flex w-full select-text flex-col">
      <ContainerHeader
        title={"Edit component specification"}
        onClose={onClose}
        subheader={true}
      />
      <h2 className="truncate p-4 font-mono text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-300">
        {componentSpecId}
      </h2>
      <EditComponentSpecificationDetails />
      <EditComponentSpecificationPositioning />
    </div>
  );
};
