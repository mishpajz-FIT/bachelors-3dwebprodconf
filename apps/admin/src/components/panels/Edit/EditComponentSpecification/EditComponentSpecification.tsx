import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useSnapshot } from "valtio";

import { EditComponentSpecificationDetails } from "./subcomponents/EditComponentSpecificationDetails.tsx";
import { EditComponentSpecificationMaterials } from "./subcomponents/EditComponentSpecificationMaterials.tsx";
import { EditComponentSpecificationMountingPoints } from "./subcomponents/EditComponentSpecificationMountingPoints.tsx";
import { EditComponentSpecificationPositioning } from "./subcomponents/EditComponentSpecificationPositioning.tsx";
import { ProductActions } from "../../../../stores/actions/ProductActions.ts";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";
import { AddCopiedComponentSpecification } from "../../Add/subcomponents/AddCopiedComponent.tsx";
import { EditContent } from "../EditContent.tsx";

interface EditComponentSpecificationProps {
  onClose: () => void;
}

export const EditComponentSpecification = ({
  onClose,
}: EditComponentSpecificationProps) => {
  const productSnap = useSnapshot(ProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const [isCopyPopupOpen, setCopyPopupOpen] = useState(false);

  const componentSpecId = editorValuesSnap.selectedComponentSpec;
  if (!componentSpecId) {
    return null;
  }

  const componentSpec = productSnap.componentSpecs[componentSpecId];
  if (!componentSpec) {
    return null;
  }

  const remove = () => {
    ProductActions.removeComponentSpec(componentSpecId, ProductStore);
    onClose();
  };

  return (
    <EditContent
      panelTitle={"Edit component specification"}
      itemName={componentSpecId}
      removeButton={"Remove component specification"}
      onClose={onClose}
      onRemove={remove}
      otherButtons={
        <button
          className="other-button mt-8 flex w-full items-center justify-center"
          onClick={() => setCopyPopupOpen(true)}
        >
          <ClipboardDocumentIcon className="size-4" />
          <span className="ml-2">Copy</span>
        </button>
      }
    >
      <EditComponentSpecificationDetails />
      <EditComponentSpecificationPositioning />
      <EditComponentSpecificationMountingPoints />
      <EditComponentSpecificationMaterials />
      <Popup isOpen={isCopyPopupOpen} onClose={() => setCopyPopupOpen(false)}>
        <AddCopiedComponentSpecification
          onClose={() => setCopyPopupOpen(false)}
        />
      </Popup>
    </EditContent>
  );
};
