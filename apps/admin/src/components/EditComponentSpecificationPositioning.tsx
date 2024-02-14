import { NumericalInput } from "@3dwebprodconf/shared/src/components/inputs/NumericalInput.tsx";
import { useEffect } from "react";
import { MathUtils } from "three";
import { useSnapshot } from "valtio";

import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";
import { refreshBounds } from "../utilities/BoundsManipulation.ts";

export const EditComponentSpecificationPositioning = () => {
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

  useEffect(() => {
    if (!ComponentsStore.components[componentSpecId].positionOffset) {
      ComponentsStore.components[componentSpecId].positionOffset = [0, 0, 0];
    }

    if (!ComponentsStore.components[componentSpecId].rotationOffset) {
      ComponentsStore.components[componentSpecId].rotationOffset = [0, 0, 0];
    }

    if (!ComponentsStore.components[componentSpecId].scaleOffset) {
      ComponentsStore.components[componentSpecId].scaleOffset = [1, 1, 1];
    }
  }, [componentSpecId]);

  return (
    <>
      <h3 className="mt-4 p-2 text-sm font-bold text-gray-800 dark:text-gray-200">
        Positioning
      </h3>
      <form>
        <div className="mx-4 grid grid-cols-1 gap-4">
          <div>
            <span className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Size
              <span className={"font-mono"}> (m)</span>
            </span>
            <div className="flex flex-row gap-1">
              {[0, 1, 2].map((index) => (
                <span
                  key={`dimension${index}`}
                  className="field bg-white dark:bg-zinc-900"
                >
                  {editorValuesSnap.boundingBoxSize?.at(index)?.toFixed(4)}
                </span>
              ))}
            </div>
          </div>
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Position
            </span>
            <div className="flex flex-row gap-1">
              {[0, 1, 2].map((index) => (
                <NumericalInput
                  key={`position${index}`}
                  submitValue={(value: number) => {
                    const values =
                      ComponentsStore.components[componentSpecId]
                        .positionOffset;
                    if (!values) {
                      throw new Error(`Missing editable values!`);
                    }
                    values[index] = value;
                    refreshBounds();
                  }}
                  currentValue={component.positionOffset?.at(index)}
                  placeholder={0}
                  maximum={1000}
                  allowEmpty={false}
                />
              ))}
            </div>
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Rotation <span className={"font-mono"}> (&deg;)</span>
            </span>
            <div className="flex flex-row gap-1">
              {[0, 1, 2].map((index) => (
                <NumericalInput
                  key={`rotation${index}`}
                  submitValue={(value: number) => {
                    const values =
                      ComponentsStore.components[componentSpecId]
                        .rotationOffset;
                    if (!values) {
                      throw new Error(`Missing editable values!`);
                    }
                    values[index] = MathUtils.degToRad(value);
                    refreshBounds();
                  }}
                  currentValue={MathUtils.radToDeg(
                    component.rotationOffset?.at(index) ?? 0
                  )}
                  placeholder={0}
                  minimum={-360}
                  maximum={360}
                  allowEmpty={false}
                />
              ))}
            </div>
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
              Scale <span className={"font-mono"}> (&times;)</span>
            </span>
            <div className="flex flex-row gap-1">
              {[0, 1, 2].map((index) => (
                <NumericalInput
                  key={`scale${index}`}
                  submitValue={(value: number) => {
                    const values =
                      ComponentsStore.components[componentSpecId].scaleOffset;
                    if (!values) {
                      throw new Error(`Missing editable values!`);
                    }
                    values[index] = value;
                    refreshBounds();
                  }}
                  currentValue={component.scaleOffset?.at(index)}
                  placeholder={1}
                  minimum={0}
                  allowEmpty={false}
                />
              ))}
            </div>
          </label>
        </div>
      </form>
    </>
  );
};
