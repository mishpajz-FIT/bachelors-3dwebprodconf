import { TextInput } from "@3dwebprodconf/shared/src/components/inputs/TextInput.tsx";
import { ChangeEvent } from "react";
import { useSnapshot } from "valtio";

import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export const EditComponentSpecificationDetails = () => {
  const componentsSnap = useSnapshot(ComponentsStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentSpecId = editorValuesSnap.selectedComponentSpec;
  if (!componentSpecId) {
    throw new Error(`No component selected`);
  }

  const component =
    componentsSnap.components[editorValuesSnap.selectedComponentSpec];
  if (!component) {
    throw new Error(`No component specification with ${componentSpecId}`);
  }

  return (
    <>
      <h3 className="p-2 text-sm font-bold text-gray-800 dark:text-gray-200">
        Details
      </h3>
      <form>
        <div className="mx-4 grid grid-cols-1 gap-4">
          <label htmlFor={"name"}>
            <span className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Name
            </span>
            <TextInput
              key={"name"}
              inputId={"name"}
              allowEmpty={false}
              placeholder={"Box"}
              currentValue={component.name}
              submitValue={(value: string) => {
                const editableComponent =
                  ComponentsStore.components[componentSpecId];
                if (!editableComponent) {
                  throw new Error(
                    `No component specification with ${componentSpecId}`
                  );
                }

                editableComponent.name = value;
              }}
            />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Description
            </span>
            <textarea
              name="description"
              className="field"
              placeholder="Description"
              value={component.description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                const { value } = e.target;

                const editableComponent =
                  ComponentsStore.components[componentSpecId];
                if (!editableComponent) {
                  throw new Error(
                    `No component specification with ${componentSpecId}`
                  );
                }

                editableComponent.description = value;
              }}
            />
          </label>
          <label htmlFor={"model"}>
            <span className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Model file
            </span>
            <TextInput
              inputId={"model"}
              key={"model"}
              allowEmpty={false}
              placeholder={"https://cdn.url/my-model.gltf"}
              currentValue={component.modelUrl}
              submitValue={(value: string) => {
                const editableComponent =
                  ComponentsStore.components[componentSpecId];
                if (!editableComponent) {
                  throw new Error(
                    `No component specification with ${componentSpecId}`
                  );
                }

                editableComponent.modelUrl = value;
              }}
            />
          </label>
          <label htmlFor={"modelImage"}>
            <span className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Preview image
            </span>
            <TextInput
              key={"modelImage"}
              inputId={"modelImage"}
              allowEmpty={true}
              placeholder={"https://cdn.url/my-model-image.jpg"}
              currentValue={component.imageUrl}
              submitValue={(value: string) => {
                const editableComponent =
                  ComponentsStore.components[componentSpecId];
                if (!editableComponent) {
                  throw new Error(
                    `No component specification with ${componentSpecId}`
                  );
                }

                editableComponent.imageUrl = value;
              }}
            />
          </label>
        </div>
      </form>
    </>
  );
};
