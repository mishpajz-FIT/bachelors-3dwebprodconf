import { NumericalInput } from "@3dwebprodconf/shared/src/components/inputs/NumericalInput.tsx";
import { useEffect } from "react";
import { MathUtils } from "three";
import { useSnapshot } from "valtio";

import { useSelectedComponentSpec } from "../../hooks/useSelectedComponentSpec.ts";
import { ComponentsStore } from "../../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../../stores/EditorValuesStore.ts";
import { refreshBounds } from "../../utilities/BoundsManipulation.ts";

export const EditComponentSpecificationPositioning = () => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();

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
    <div>
      <h3 className="section-heading">Positioning</h3>
      <form>
        <div className="mx-4 grid grid-cols-1 gap-4">
          <div>
            <span className="label">
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
            <span className="label">Position</span>
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
                  currentValue={componentSpec.positionOffset?.at(index)}
                  placeholder={0}
                  maximum={1000}
                  allowEmpty={false}
                />
              ))}
            </div>
          </label>
          <label>
            <span className="label">
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
                    componentSpec.rotationOffset?.at(index) ?? 0
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
            <span className="label">
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
                  currentValue={componentSpec.scaleOffset?.at(index)}
                  placeholder={1}
                  minimum={0}
                  allowEmpty={false}
                />
              ))}
            </div>
          </label>
        </div>
      </form>
    </div>
  );
};
