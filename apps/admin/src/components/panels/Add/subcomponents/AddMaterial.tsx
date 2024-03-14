import { MaterialSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { FormEvent, useState } from "react";

import { useSelectedComponentSpec } from "../../../../hooks/useSelectedComponentSpec.ts";
import { ProductActions } from "../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";
import { refreshBounds } from "../../../../utilities/BoundsManipulation.ts";
import { AddContent } from "../AddContent.tsx";

interface AddMaterialProps {
  onClose: () => void;
}

export const AddMaterial = ({ onClose }: AddMaterialProps) => {
  const { componentSpecId } = useSelectedComponentSpec();

  const [isShowingError, setShowingError] = useState(false);

  const addNewMaterial = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowingError(false);

    const data = new FormData(event.currentTarget);
    const id = data.get("id") as string;

    const editableComponent = ProductActions.getComponentSpec(
      componentSpecId,
      ProductStore
    );

    if (ProductActions.materialSpecExists(editableComponent, id)) {
      setShowingError(true);
      return;
    }

    const newMaterialSpec: MaterialSpecification = {
      name: data.get("name") as string,
      modelMaterials: [],
      colorVariationsSpecs: {},
    };

    ProductActions.addMaterialSpec(id, newMaterialSpec, editableComponent);

    onClose();
    refreshBounds();
  };

  return (
    <AddContent
      heading={"Add new material"}
      onClose={onClose}
      showingError={isShowingError}
      errorReason={"Material with this ID already exists."}
    >
      <form onSubmit={addNewMaterial}>
        <div className="m-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label-aligned">ID</span>
            <input
              type="text"
              name="id"
              className="field"
              placeholder="wheels-front"
              required={true}
            />
          </label>
          <label>
            <span className="label-aligned">Name</span>
            <input
              type="text"
              name="name"
              className="field"
              placeholder="Front wheels"
              required={true}
            />
          </label>
          <button type="submit" className="primary-button" tabIndex={0}>
            Add
          </button>
        </div>
      </form>
    </AddContent>
  );
};
