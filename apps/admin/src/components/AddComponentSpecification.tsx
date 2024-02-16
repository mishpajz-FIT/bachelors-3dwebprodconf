import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { ComponentSpecification } from "@3dwebprodconf/shared/src/interfaces/ProductSpecification.ts";
import { FormEvent } from "react";

import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { refreshBounds } from "../utilities/BoundsManipulation.ts";

interface AddComponentSpecificationProps {
  onClose: () => void;
}

export const AddComponentSpecification = ({
  onClose,
}: AddComponentSpecificationProps) => {
  const addNewComponent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const requiredFields = [
      "id",
      "name",
      "description",
      "imageUrl",
      "modelUrl",
    ];

    const hasAllRequiredFields = requiredFields.every((field) =>
      data.has(field)
    );

    if (!hasAllRequiredFields) {
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

    ComponentsStore.components[data.get("id") as string] = newComponent;
    onClose();
    refreshBounds();
  };

  const renderTextInput = (
    displayName: string,
    type: string,
    placeholder: string,
    required?: boolean
  ) => (
    <label>
      <span className="label">{displayName}</span>
      <input
        type="string"
        name={type}
        className="field"
        placeholder={placeholder}
        required={required}
      />
    </label>
  );

  return (
    <div className="flex min-w-96 flex-col">
      <ContainerHeader
        title={"Add new component"}
        onClose={onClose}
        subheader={true}
      />
      <form onSubmit={addNewComponent}>
        <div className="m-4 grid grid-cols-1 gap-4">
          {renderTextInput("ID", "id", "component-1", true)}
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
    </div>
  );
};
