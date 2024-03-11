import { useSelectedComponentSpec } from "../../../../../hooks/useSelectedComponentSpec.ts";
import { useSelectedMountingPointSpec } from "../../../../../hooks/useSelectedMountingPointSpec.ts";
import { ProductActions } from "../../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";

export const EditMountingPointSpecificationDetails = () => {
  const { componentSpecId } = useSelectedComponentSpec();
  const { mountingPointSpecId, mountingPointSpec } =
    useSelectedMountingPointSpec();

  return (
    <div>
      <h3 className="section-heading-aligned">Details</h3>
      <div className="mx-4">
        <label htmlFor={"required-checkbox"}>
          <span className="label-aligned">Required</span>
          <input
            id="required-checkbox"
            type="checkbox"
            checked={mountingPointSpec.isRequired}
            className="field size-4"
            onChange={() => {
              const editableMountingPoint = ProductActions.getMountingPointSpec(
                ProductActions.getComponentSpec(componentSpecId, ProductStore),
                mountingPointSpecId
              );

              editableMountingPoint.isRequired =
                !editableMountingPoint.isRequired;
            }}
          />
        </label>
      </div>
    </div>
  );
};
