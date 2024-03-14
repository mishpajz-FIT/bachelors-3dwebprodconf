import { TextInput } from "@3dwebprodconf/shared/src/components/inputs/TextInput.tsx";

import { useSelectedComponentSpec } from "../../../../../hooks/useSelectedComponentSpec.ts";
import { useSelectedMaterialSpec } from "../../../../../hooks/useSelectedMaterialSpec.ts";
import { ProductActions } from "../../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";

export const EditMaterialSpecificationDetails = () => {
  const { componentSpecId } = useSelectedComponentSpec();
  const { materialSpecId, materialSpec } = useSelectedMaterialSpec();

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
              currentValue={materialSpec.name}
              submitValue={(value: string) => {
                ProductActions.getMaterialSpec(
                  ProductActions.getComponentSpec(
                    componentSpecId,
                    ProductStore
                  ),
                  materialSpecId
                ).name = value;
              }}
            />
          </label>
        </div>
      </form>
    </div>
  );
};
