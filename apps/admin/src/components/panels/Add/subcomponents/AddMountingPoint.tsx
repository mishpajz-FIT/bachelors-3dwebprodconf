import { MountingPointSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { FormEvent, useState } from "react";

import { useSelectedComponentSpec } from "../../../../hooks/useSelectedComponentSpec.ts";
import { ProductActions } from "../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";
import { refreshBounds } from "../../../../utilities/BoundsManipulation.ts";
import { AddContent } from "../AddContent.tsx";

interface AddMountingPointProps {
  onClose: () => void;
}

export const AddMountingPoint = ({ onClose }: AddMountingPointProps) => {
  const { componentSpecId } = useSelectedComponentSpec();

  const [isShowingError, setShowingError] = useState(false);

  const addNewMountingPoint = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowingError(false);

    const data = new FormData(event.currentTarget);
    const id = data.get("id") as string;

    const editableComponent = ProductActions.getComponentSpec(
      componentSpecId,
      ProductStore
    );

    if (ProductActions.mountingPointSpecExists(editableComponent, id)) {
      setShowingError(true);
      return;
    }

    const newMountingPointSpec: MountingPointSpecification = {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      isRequired: false,
      mountableComponents: [],
    };

    ProductActions.addMountingPointSpec(
      id,
      newMountingPointSpec,
      editableComponent
    );

    onClose();
    refreshBounds();
  };

  return (
    <AddContent
      heading={"Add new mounting point"}
      onClose={onClose}
      showingError={isShowingError}
      errorReason={"Mounting point with this ID already exists."}
    >
      <form onSubmit={addNewMountingPoint}>
        <div className="m-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label-aligned">ID</span>
            <input
              type="text"
              name="id"
              className="field"
              placeholder="top-1"
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
