import { useSnapshot } from "valtio";

import { EditMountingPointSpecificationComponents } from "./subcomponents/EditMountingPointSpecificationComponents.tsx";
import { EditMountingPointSpecificationDetails } from "./subcomponents/EditMountingPointSpecificationDetails.tsx";
import { EditMountingPointSpecificationPositioning } from "./subcomponents/EditMountingPointSpecificationPositioning.tsx";
import { ProductActions } from "../../../../stores/actions/ProductActions.ts";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";
import { EditContent } from "../EditContent.tsx";

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

    ProductActions.removeMountingPointSpec(
      ProductActions.getComponentSpec(componentSpecId, ProductStore),
      mountingPointId
    );
    onClose();
  };

  return (
    <EditContent
      panelTitle={"Edit mounting point"}
      itemName={mountingPointId}
      removeButton={"Remove mounting point"}
      onClose={onClose}
      onRemove={remove}
    >
      <EditMountingPointSpecificationDetails />
      <EditMountingPointSpecificationPositioning />
      <EditMountingPointSpecificationComponents />
    </EditContent>
  );
};
