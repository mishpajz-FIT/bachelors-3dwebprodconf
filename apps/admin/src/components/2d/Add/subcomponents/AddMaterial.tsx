import { FormEvent, useState } from "react";

import { useSelectedComponentSpec } from "../../../../hooks/useSelectedComponentSpec.ts";
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

    const editableComponent = ProductStore.componentSpecs[componentSpecId];

    if (
      Object.prototype.hasOwnProperty.call(
        editableComponent.materialSpecs,
        data.get("id") as string
      )
    ) {
      setShowingError(true);
      return;
    }

    editableComponent.materialSpecs[data.get("id") as string] = {
      name: data.get("name") as string,
      modelMaterials: [],
      colorVariationsSpecs: {},
    };

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
            <span className="label">ID</span>
            <input
              type="text"
              name="id"
              className="field"
              placeholder="wheels-front"
              required={true}
            />
          </label>
          <label>
            <span className="label">Name</span>
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
