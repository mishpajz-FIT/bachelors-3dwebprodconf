import { useSnapshot } from "valtio";

import { EditComponentSpecificationDetails } from "./subcomponents/EditComponentSpecificationDetails.tsx";
import { EditComponentSpecificationMaterials } from "./subcomponents/EditComponentSpecificationMaterials.tsx";
import { EditComponentSpecificationMountingPoints } from "./subcomponents/EditComponentSpecificationMountingPoints.tsx";
import { EditComponentSpecificationPositioning } from "./subcomponents/EditComponentSpecificationPositioning.tsx";
import { removeComponentSpec } from "../../../../../stores/actions/ProductActions.ts";
import { EditorValuesStore } from "../../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";
import { EditContent } from "../EditContent.tsx";

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
    removeComponentSpec(componentSpecId);
    onClose();
  };

  return (
    <EditContent
      panelTitle={"Edit component specification"}
      itemName={componentSpecId}
      removeButton={"Remove component specification"}
      onClose={onClose}
      onRemove={remove}
    >
      <EditComponentSpecificationDetails />
      <EditComponentSpecificationPositioning />
      <EditComponentSpecificationMountingPoints />
      <EditComponentSpecificationMaterials />
    </EditContent>
  );
};
