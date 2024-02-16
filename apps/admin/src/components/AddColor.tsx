import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { FormEvent, useState } from "react";

import { useSelectedComponentSpec } from "../hooks/useSelectedComponentSpec.ts";
import { useSelectedMaterialSpec } from "../hooks/useSelectedMaterialSpec.ts";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { refreshBounds } from "../utilities/BoundsManipulation.ts";

interface AddMaterialProps {
  onClose: () => void;
}

export const AddColor = ({ onClose }: AddMaterialProps) => {
  const { componentSpecId } = useSelectedComponentSpec();
  const { materialSpecId } = useSelectedMaterialSpec();

  const [pickedColor, setPickedColor] = useState("#ffffff");

  const addNewColor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (!data.has("id")) {
      return;
    }

    const editableMaterial =
      ComponentsStore.components[componentSpecId].materialSpecs[materialSpecId];

    editableMaterial.colorVariationsSpecs[data.get("id") as string] = {
      name: data.get("name") as string,
      value: data.get("value") as string,
    };

    onClose();
    refreshBounds();
  };

  return (
    <div className="flex min-w-96 flex-col">
      <ContainerHeader
        title={"Add new color"}
        onClose={onClose}
        subheader={true}
      />
      <form onSubmit={addNewColor}>
        <div className="m-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label">ID</span>
            <input
              type="string"
              name="id"
              className="field"
              placeholder="red-04"
              required={true}
            />
          </label>
          <label>
            <span className="label">Name</span>
            <input
              type="string"
              name="name"
              className="field"
              placeholder="Crimson red"
              required={true}
            />
          </label>
          <label>
            <span className="label">Value</span>
            <input
              type="color"
              name="value"
              className="block h-10 w-14 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-1 focus:border-[var(--primary-light)] focus:ring-[var(--primary-light)] dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-[var(--primary-dark)] dark:focus:ring-[var(--primary-dark)]"
              value={pickedColor}
              onChange={(e) => setPickedColor(e.target.value)}
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
