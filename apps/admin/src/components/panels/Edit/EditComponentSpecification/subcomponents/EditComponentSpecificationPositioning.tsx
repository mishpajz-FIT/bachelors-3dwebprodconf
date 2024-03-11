import { NumericalInput } from "@3dwebprodconf/shared/src/components/inputs/NumericalInput.tsx";
import { useEffect } from "react";
import { MathUtils } from "three";
import { useSnapshot } from "valtio";

import { useSelectedComponentSpec } from "../../../../../hooks/useSelectedComponentSpec.ts";
import { ProductActions } from "../../../../../stores/actions/ProductActions.ts";
import { EditorValuesStore } from "../../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";

export const EditComponentSpecificationPositioning = () => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();

  useEffect(() => {
    const component = ProductActions.getComponentSpec(
      componentSpecId,
      ProductStore
    );

    if (!component.positionOffset) {
      component.positionOffset = [0, 0, 0];
    }

    if (!component.rotationOffset) {
      component.rotationOffset = [0, 0, 0];
    }

    if (!component.scaleOffset) {
      component.scaleOffset = [1, 1, 1];
    }
  }, [componentSpecId]);

  return (
    <div>
      <h3 className="section-heading-aligned">Positioning</h3>
      <form>
        <div className="mx-4 grid grid-cols-1 gap-4">
          <div>
            <span className="label-aligned">
              Size
              <span className="font-mono"> (m)</span>
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
            <span className="label-aligned">Position</span>
            <div className="flex flex-row gap-1">
              {[0, 1, 2].map((index) => (
                <NumericalInput
                  key={`position${index}`}
                  submitValue={(value: number) => {
                    const values = ProductActions.getComponentSpec(
                      componentSpecId,
                      ProductStore
                    ).positionOffset;
                    if (!values) {
                      throw new Error(
                        `Missing position values on ${componentSpecId}!`
                      );
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
            <span className="label-aligned">
              Rotation <span className="font-mono"> (&deg;)</span>
            </span>
            <div className="flex flex-row gap-1">
              {[0, 1, 2].map((index) => (
                <NumericalInput
                  key={`rotation${index}`}
                  submitValue={(value: number) => {
                    const values = ProductActions.getComponentSpec(
                      componentSpecId,
                      ProductStore
                    ).rotationOffset;
                    if (!values) {
                      throw new Error(
                        `Missing rotation values on ${componentSpecId}!`
                      );
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
            <span className="label-aligned">
              Scale <span className={"font-mono"}> (&times;)</span>
            </span>
            <div className="flex flex-row gap-1">
              {[0, 1, 2].map((index) => (
                <NumericalInput
                  key={`scale${index}`}
                  submitValue={(value: number) => {
                    const values = ProductActions.getComponentSpec(
                      componentSpecId,
                      ProductStore
                    ).scaleOffset;
                    if (!values) {
                      throw new Error(
                        `Missing scale values on ${componentSpecId}!`
                      );
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
