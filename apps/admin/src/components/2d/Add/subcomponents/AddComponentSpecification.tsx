import { ComponentSpecification } from "@3dwebprodconf/shared/src/interfaces/ProductSpecification.ts";
import { FormEvent, useState } from "react";

import { ProductStore } from "../../../../stores/ProductStore.ts";
import { refreshBounds } from "../../../../utilities/BoundsManipulation.ts";
import { AddContent } from "../AddContent.tsx";

interface AddComponentSpecificationProps {
  onClose: () => void;
}

export const AddComponentSpecification = ({
  onClose,
}: AddComponentSpecificationProps) => {
  const [isShowingError, setShowingError] = useState(false);

  const addNewComponent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowingError(false);

    const data = new FormData(event.currentTarget);

    if (
      Object.prototype.hasOwnProperty.call(
        ProductStore.componentSpecs,
        data.get("id") as string
      )
    ) {
      setShowingError(true);
      return;
    }

    const newComponent: ComponentSpecification = {
      name: data.get("name") as string,
      description: data.get("description") as string,
      imageUrl: data.get("imageUrl") as string,
      modelUrl: data.get("modelUrl") as string,
      // Parse JSON strings from FormData into objects
      materialSpecs: {},
      mountingPointsSpecs: {},
    };

    if (data.has("price")) {
      newComponent.price = parseFloat(data.get("price") as string);
    }

    ProductStore.componentSpecs[data.get("id") as string] = newComponent;
    setShowingError(false);
    onClose();
    refreshBounds();
  };

  const renderTextInput = (
    displayName: string,
    type: string,
    placeholder: string
  ) => (
    <label>
      <span className="label">{displayName}</span>
      <input
        type="text"
        name={type}
        className="field"
        placeholder={placeholder}
        required={true}
      />
    </label>
  );

  return (
    <AddContent
      heading={"Add new component"}
      onClose={onClose}
      showingError={isShowingError}
      errorReason={"Component with this ID already exists."}
    >
      <form onSubmit={addNewComponent}>
        <div className="m-4 grid grid-cols-1 gap-4">
          {renderTextInput("ID", "id", "component-1")}
          {renderTextInput("Name", "name", "Box")}
          <label>
            <span className="label">Description</span>
            <textarea
              name="description"
              className="field"
              placeholder="Description"
              required={true}
            />
          </label>
          {renderTextInput(
            "Model file",
            "modelUrl",
            "https://cdn.url/my-model.gltf"
          )}
          {renderTextInput(
            "Preview image",
            "imageUrl",
            "https://cdn.url/my-model-image.jpg"
          )}
          <button type="submit" className="primary-button" tabIndex={0}>
            Add
          </button>
        </div>
      </form>
    </AddContent>
  );
};
