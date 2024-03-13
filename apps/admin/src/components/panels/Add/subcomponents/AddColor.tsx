import { ColorSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { FormEvent, useState } from "react";

import { useSelectedComponentSpec } from "../../../../hooks/useSelectedComponentSpec.ts";
import { useSelectedMaterialSpec } from "../../../../hooks/useSelectedMaterialSpec.ts";
import { ProductActions } from "../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";
import { refreshBounds } from "../../../../utilities/BoundsManipulation.ts";
import { AddContent } from "../AddContent.tsx";

interface AddMaterialProps {
  onClose: () => void;
}

export const AddColor = ({ onClose }: AddMaterialProps) => {
  const { componentSpecId } = useSelectedComponentSpec();
  const { materialSpecId } = useSelectedMaterialSpec();

  const [pickedColor, setPickedColor] = useState("#ffffff");

  const [isShowingError, setShowingError] = useState(false);

  const addNewColor = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowingError(false);

    const data = new FormData(event.currentTarget);
    const id = data.get("id") as string;

    const editableMaterial = ProductActions.getMaterialSpec(
      ProductActions.getComponentSpec(componentSpecId, ProductStore),
      materialSpecId
    );
    if (ProductActions.colorSpecExists(editableMaterial, id)) {
      setShowingError(true);
      return;
    }

    const newColorSpec: ColorSpecification = {
      name: data.get("name") as string,
      value: data.get("value") as string,
      sortIndex: Object.keys(editableMaterial.colorVariationsSpecs).length,
    };

    ProductActions.addColorSpec(id, newColorSpec, editableMaterial);

    onClose();
    refreshBounds();
  };

  return (
    <AddContent
      heading={"Add new color"}
      onClose={onClose}
      showingError={isShowingError}
      errorReason={"Color with this ID already exists."}
    >
      <form onSubmit={addNewColor}>
        <div className="m-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label-aligned">ID</span>
            <input
              type="text"
              name="id"
              className="field"
              placeholder="red-04"
              required={true}
            />
          </label>
          <label>
            <span className="label-aligned">Name</span>
            <input
              type="text"
              name="name"
              className="field"
              placeholder="Crimson red"
              required={true}
            />
          </label>
          <label>
            <span className="label-aligned">Value</span>
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
    </AddContent>
  );
};
