import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { FormEvent } from "react";

import { useSelectedComponentSpec } from "../hooks/useSelectedComponentSpec.ts";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { refreshBounds } from "../utilities/BoundsManipulation.ts";

interface AddMaterialProps {
  onClose: () => void;
}

export const AddMaterial = ({ onClose }: AddMaterialProps) => {
  const { componentSpecId } = useSelectedComponentSpec();
  const addNewMaterial = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (!data.has("id")) {
      return;
    }

    const editableComponent = ComponentsStore.components[componentSpecId];

    editableComponent.materialSpecs[data.get("id") as string] = {
      name: data.get("name") as string,
      modelMaterials: [],
      colorVariationsSpecs: {},
    };

    onClose();
    refreshBounds();
  };

  return (
    <div className="flex min-w-96 flex-col">
      <ContainerHeader
        title={"Add new material"}
        onClose={onClose}
        subheader={true}
      />
      <form onSubmit={addNewMaterial}>
        <div className="m-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label">ID</span>
            <input
              type="string"
              name="id"
              className="field"
              placeholder="wheels-front"
              required={true}
            />
          </label>
          <label>
            <span className="label">Name</span>
            <input
              type="string"
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
    </div>
  );
};
