import { NumericalInput } from "@3dwebprodconf/shared/src/components/inputs/NumericalInput.tsx";
import { useEffect } from "react";
import { MathUtils } from "three";
import { useSnapshot } from "valtio";

import { useSelectedComponentSpec } from "../../../../../../hooks/useSelectedComponentSpec.ts";
import { EditorValuesStore } from "../../../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../../../stores/ProductStore.ts";

export const EditComponentSpecificationPositioning = () => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();

  useEffect(() => {
    if (!ProductStore.componentSpecs[componentSpecId].positionOffset) {
      ProductStore.componentSpecs[componentSpecId].positionOffset = [0, 0, 0];
    }

    if (!ProductStore.componentSpecs[componentSpecId].rotationOffset) {
      ProductStore.componentSpecs[componentSpecId].rotationOffset = [0, 0, 0];
    }

    if (!ProductStore.componentSpecs[componentSpecId].scaleOffset) {
      ProductStore.componentSpecs[componentSpecId].scaleOffset = [1, 1, 1];
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
                      ProductStore.componentSpecs[componentSpecId]
                        .positionOffset;
                    if (!values) {
                      throw new Error(`Missing editable values!`);
                    }
                    values[index] = value;
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
                      ProductStore.componentSpecs[componentSpecId]
                        .rotationOffset;
                    if (!values) {
                      throw new Error(`Missing editable values!`);
                    }
                    values[index] = MathUtils.degToRad(value);
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
                      ProductStore.componentSpecs[componentSpecId].scaleOffset;
                    if (!values) {
                      throw new Error(`Missing editable values!`);
                    }
                    values[index] = value;
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
