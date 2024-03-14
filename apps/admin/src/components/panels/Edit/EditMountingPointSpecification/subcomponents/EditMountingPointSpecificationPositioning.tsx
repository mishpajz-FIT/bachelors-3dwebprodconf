import { NumericalInput } from "@3dwebprodconf/shared/src/components/inputs/NumericalInput.tsx";
import { MathUtils } from "three";

import { useSelectedComponentSpec } from "../../../../../hooks/useSelectedComponentSpec.ts";
import { useSelectedMountingPointSpec } from "../../../../../hooks/useSelectedMountingPointSpec.ts";
import { ProductActions } from "../../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";

export const EditMountingPointSpecificationPositioning = () => {
  const { componentSpecId } = useSelectedComponentSpec();
  const { mountingPointSpecId, mountingPointSpec } =
    useSelectedMountingPointSpec();

  return (
    <div>
      <h3 className="section-heading-aligned">Positioning</h3>
      <form>
        <div className="mx-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label-aligned">Position</span>
            <div className="flex flex-row gap-1">
              {[0, 1, 2].map((index) => (
                <NumericalInput
                  key={`position${index}`}
                  submitValue={(value: number) => {
                    ProductActions.getMountingPointSpec(
                      ProductActions.getComponentSpec(
                        componentSpecId,
                        ProductStore
                      ),
                      mountingPointSpecId
                    ).position[index] = value;
                  }}
                  currentValue={mountingPointSpec.position.at(index)}
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
                    ProductActions.getMountingPointSpec(
                      ProductActions.getComponentSpec(
                        componentSpecId,
                        ProductStore
                      ),
                      mountingPointSpecId
                    ).rotation[index] = MathUtils.degToRad(value);
                  }}
                  currentValue={MathUtils.radToDeg(
                    mountingPointSpec.rotation.at(index) ?? 0
                  )}
                  placeholder={0}
                  minimum={-360}
                  maximum={360}
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
