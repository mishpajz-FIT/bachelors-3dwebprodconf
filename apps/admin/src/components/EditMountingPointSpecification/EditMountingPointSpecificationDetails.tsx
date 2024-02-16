import { useSelectedComponentSpec } from "../../hooks/useSelectedComponentSpec.ts";
import { useSelectedMountingPointSpec } from "../../hooks/useSelectedMountingPointSpec.ts";
import { ComponentsStore } from "../../stores/ComponentsStore.ts";

export const EditMountingPointSpecificationDetails = () => {
  const { componentSpecId } = useSelectedComponentSpec();
  const { mountingPointSpecId, mountingPoint } = useSelectedMountingPointSpec();

  return (
    <div>
      <h3 className="section-heading">Details</h3>
      <div className="mx-4">
        <label htmlFor={"required-checkbox"}>
          <span className="label">Required</span>
          <input
            id="required-checkbox"
            type="checkbox"
            checked={mountingPoint.isRequired}
            className="field size-4"
            onChange={() => {
              const editableMountingPoint =
                ComponentsStore.components[componentSpecId].mountingPointsSpecs[
                  mountingPointSpecId
                ];
              if (!editableMountingPoint) {
                throw new Error(
                  `No mounting point specification with ${mountingPointSpecId} on component ${componentSpecId}`
                );
              }

              editableMountingPoint.isRequired =
                !editableMountingPoint.isRequired;
            }}
          />
        </label>
      </div>
    </div>
  );
};
