import { TextInput } from "@3dwebprodconf/shared/src/components/inputs/TextInput.tsx";

import { useSelectedComponentSpec } from "../../../../../hooks/useSelectedComponentSpec.ts";
import { useSelectedMaterialSpec } from "../../../../../hooks/useSelectedMaterialSpec.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";

export const EditMaterialSpecificationDetails = () => {
  const { componentSpecId } = useSelectedComponentSpec();
  const { materialSpecId, materialSpec } = useSelectedMaterialSpec();

  return (
    <div>
      <h3 className="section-heading">Details</h3>
      <form>
        <div className="mx-4 grid grid-cols-1 gap-4">
          <label htmlFor={"name"}>
            <span className="label">Name</span>
            <TextInput
              key={"name"}
              inputId={"name"}
              allowEmpty={false}
              placeholder={"Box"}
              currentValue={materialSpec.name}
              submitValue={(value: string) => {
                const editableMaterial =
                  ProductStore.componentSpecs[componentSpecId].materialSpecs[
                    materialSpecId
                  ];

                editableMaterial.name = value;
              }}
            />
          </label>
        </div>
      </form>
    </div>
  );
};
