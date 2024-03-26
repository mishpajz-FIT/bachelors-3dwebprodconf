import { ImageURLInput } from "@3dwebprodconf/shared/src/components/inputs/ImageURLInput.tsx";
import { TextInput } from "@3dwebprodconf/shared/src/components/inputs/TextInput.tsx";
import { ChangeEvent } from "react";

import { useSelectedComponentSpec } from "../../../../../hooks/useSelectedComponentSpec.ts";
import { ProductActions } from "../../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";

export const EditComponentSpecificationDetails = () => {
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();

  return (
    <div>
      <h3 className="section-heading-aligned">Details</h3>
      <form>
        <div className="mx-4 grid grid-cols-1 gap-4">
          <label htmlFor={"name"}>
            <span className="label-aligned">Name</span>
            <TextInput
              key={"name"}
              inputId={"name"}
              allowEmpty={false}
              placeholder={"Box"}
              currentValue={componentSpec.name}
              submitValue={(value: string) => {
                ProductActions.getComponentSpec(
                  componentSpecId,
                  ProductStore
                ).name = value;
              }}
            />
          </label>
          <label>
            <span className="label-aligned">Description</span>
            <textarea
              name="description"
              className="field"
              placeholder="Description"
              value={componentSpec.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                ProductActions.getComponentSpec(
                  componentSpecId,
                  ProductStore
                ).description = e.target.value;
              }}
            />
          </label>
          <label htmlFor={"model"}>
            <span className="label-aligned">Model file</span>
            <TextInput
              inputId={"model"}
              key={"model"}
              allowEmpty={false}
              placeholder={"https://cdn.url/my-model.gltf"}
              currentValue={componentSpec.modelUrl}
              submitValue={(value: string) => {
                ProductActions.getComponentSpec(
                  componentSpecId,
                  ProductStore
                ).modelUrl = value;
              }}
            />
          </label>
          <label htmlFor={"modelImage"}>
            <span className="label-aligned">Preview image</span>
            <ImageURLInput
              key={"modelImage"}
              inputId={"modelImage"}
              allowEmpty={true}
              placeholder={"https://cdn.url/my-model-image.jpg"}
              currentValue={componentSpec.imageUrl}
              submitValue={(value: string) => {
                ProductActions.getComponentSpec(
                  componentSpecId,
                  ProductStore
                ).imageUrl = value;
              }}
            />
          </label>
          <label htmlFor={"ignore-collisions-checkbox"}>
            <span className="label-aligned">Ignore collisions</span>
            <input
              id="ignore-collisions-checkbox"
              type="checkbox"
              checked={componentSpec.ignoreCollisions}
              className="field size-4"
              onChange={() => {
                const editableComponent = ProductActions.getComponentSpec(
                  componentSpecId,
                  ProductStore
                );

                editableComponent.ignoreCollisions =
                  !editableComponent.ignoreCollisions;
              }}
            />
          </label>
        </div>
      </form>
    </div>
  );
};
