import { ColorSpecification } from "@3dwebprodconf/shared/src/interfaces/ProductSpecification.ts";
import { useSnapshot } from "valtio";

import { EditComponentColorsColorTile } from "./EditComponentColorsColorTile.tsx";
import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../stores/UserCreationStore.ts";

interface EditComponentColorsProps {
  componentId: string;
}

const defaultColorSpec: ColorSpecification = {
  name: "Default",
  value: "#ffffff",
};

export const EditComponentColors = ({
  componentId,
}: EditComponentColorsProps) => {
  const userCreationSnap = useSnapshot(UserCreationStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const component = userCreationSnap.components[componentId];
  if (!component) return null;

  const componentSpecId = component.componentSpec;
  const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];
  if (!componentSpec) return null;

  return (
    <>
      {Object.entries(componentSpec.materialSpecs).map(
        ([materialSpecId, materialSpec], materialIndex) => (
          <div key={materialIndex} className="p-1">
            <h2 className="mt-1 text-sm font-normal">{materialSpec.name}</h2>
            <div className="mt-1 flex flex-wrap justify-center rounded-md p-1 outline outline-1 outline-slate-100 dark:outline-zinc-800">
              <EditComponentColorsColorTile
                componentId={componentId}
                materialSpecId={materialSpecId}
                colorSpec={defaultColorSpec}
                colorSpecId={undefined}
                key={"default"}
              />
              {Object.entries(materialSpec.colorVariationsSpecs).map(
                ([colorSpecId, colorSpec], index) => (
                  <EditComponentColorsColorTile
                    componentId={componentId}
                    materialSpecId={materialSpecId}
                    colorSpec={colorSpec}
                    colorSpecId={colorSpecId}
                    key={index}
                  />
                )
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};
