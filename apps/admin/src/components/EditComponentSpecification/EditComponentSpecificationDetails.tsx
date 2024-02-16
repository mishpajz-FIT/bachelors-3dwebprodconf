import { TextInput } from "@3dwebprodconf/shared/src/components/inputs/TextInput.tsx";
import { ChangeEvent } from "react";

import { useSelectedComponentSpec } from "../../hooks/useSelectedComponentSpec.ts";
import { ComponentsStore } from "../../stores/ComponentsStore.ts";

export const EditComponentSpecificationDetails = () => {
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();

  return (
    <div>
      <h3 className="section-heading">Details</h3>
      <form>
        <div className="mx-4 grid grid-cols-1 gap-4">
          <label htmlFor={"name"}>
            <span className="label">Name</span>
            <TextInput
              key={"name"}
              inputId={"name"}
              allowEmpty={false}
              placeholder={"Box"}
              currentValue={componentSpec.name}
              submitValue={(value: string) => {
                const editableComponent =
                  ComponentsStore.components[componentSpecId];

                editableComponent.name = value;
              }}
            />
          </label>
          <label>
            <span className="label">Description</span>
            <textarea
              name="description"
              className="field"
              placeholder="Description"
              value={componentSpec.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                const editableComponent =
                  ComponentsStore.components[componentSpecId];
                if (!editableComponent) {
                  throw new Error(
                    `No component specification with ${componentSpecId}`
                  );
                }

                editableComponent.description = e.target.value;
              }}
            />
          </label>
          <label htmlFor={"model"}>
            <span className="label">Model file</span>
            <TextInput
              inputId={"model"}
              key={"model"}
              allowEmpty={false}
              placeholder={"https://cdn.url/my-model.gltf"}
              currentValue={componentSpec.modelUrl}
              submitValue={(value: string) => {
                const editableComponent =
                  ComponentsStore.components[componentSpecId];

                editableComponent.modelUrl = value;
              }}
            />
          </label>
          <label htmlFor={"modelImage"}>
            <span className="label">Preview image</span>
            <TextInput
              key={"modelImage"}
              inputId={"modelImage"}
              allowEmpty={true}
              placeholder={"https://cdn.url/my-model-image.jpg"}
              currentValue={componentSpec.imageUrl}
              submitValue={(value: string) => {
                const editableComponent =
                  ComponentsStore.components[componentSpecId];

                editableComponent.imageUrl = value;
              }}
            />
          </label>
        </div>
      </form>
    </div>
  );
};
