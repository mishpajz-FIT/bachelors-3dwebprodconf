import { FormEvent, useState } from "react";

import { useSelectedComponentSpec } from "../../../../../hooks/useSelectedComponentSpec.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";
import { refreshBounds } from "../../../../../utilities/BoundsManipulation.ts";
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

    const editableComponent = ProductStore.componentSpecs[componentSpecId];

    if (
      Object.prototype.hasOwnProperty.call(
        editableComponent.mountingPointsSpecs,
        data.get("id") as string
      )
    ) {
      setShowingError(true);
      return;
    }

    editableComponent.mountingPointsSpecs[data.get("id") as string] = {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      isRequired: false,
      mountableComponents: [],
    };

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
            <span className="label">ID</span>
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
