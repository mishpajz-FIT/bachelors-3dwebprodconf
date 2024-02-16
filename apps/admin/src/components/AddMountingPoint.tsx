import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { FormEvent } from "react";

import { useSelectedComponentSpec } from "../hooks/useSelectedComponentSpec.ts";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { refreshBounds } from "../utilities/BoundsManipulation.ts";

interface AddMountingPointProps {
  onClose: () => void;
}

export const AddMountingPoint = ({ onClose }: AddMountingPointProps) => {
  const { componentSpecId } = useSelectedComponentSpec();
  const addNewMountingPoint = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (!data.has("id")) {
      return;
    }

    const editableComponent = ComponentsStore.components[componentSpecId];
    if (!editableComponent) {
      throw new Error(`No component specification with ${componentSpecId}`);
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
    <div className="flex min-w-96 flex-col">
      <ContainerHeader
        title={"Add new mounting point"}
        onClose={onClose}
        subheader={true}
      />
      <form onSubmit={addNewMountingPoint}>
        <div className="m-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label">ID</span>
            <input
              type="string"
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
    </div>
  );
};
