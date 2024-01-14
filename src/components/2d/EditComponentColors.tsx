import { useSnapshot } from "valtio";

import { ColorSpecification } from "../../interfaces/ProductSpecification.ts";
import { ProductSpecificationStore } from "../../stores/ProductSpecificationStore.ts";
import { UserProductStore } from "../../stores/UserProductStore.ts";

interface EditComponentColorsProps {
  componentId: string;
}

export const EditComponentColors = ({
  componentId,
}: EditComponentColorsProps) => {
  const userProductSnap = useSnapshot(UserProductStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const component = userProductSnap.components[componentId];
  if (!component) return null;

  const componentSpecId = component.componentSpec;
  const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];
  if (!componentSpec) return null;

  const defaultColorSpec: ColorSpecification = {
    name: "Default",
    value: "#ffffff",
  };

  const materials = userProductSnap.components[componentId].materials;

  const colorTile = (
    materialSpecId: string,
    colorSpec: ColorSpecification,
    colorSpecId?: string,
    key?: string | number
  ) => {
    const isSelected = materials[materialSpecId] === colorSpecId;

    if (isSelected) {
      return (
        <div
          key={key}
          className="m-1 flex w-full items-center rounded bg-slate-50 outline outline-1 outline-slate-100 dark:bg-slate-800 dark:outline-slate-800"
          aria-label="selected"
        >
          <div
            className="m-2 h-8 w-8 rounded-sm outline outline-2 outline-offset-2"
            style={{
              backgroundColor: colorSpec.value,
              outlineColor: colorSpec.value,
            }}
          />
          <span
            className={
              "ml-2 truncate text-sm font-light leading-tight text-gray-600 dark:text-gray-400"
            }
          >
            {colorSpec.name}
          </span>
        </div>
      );
    } else {
      return (
        <button
          key={key}
          className="m-1 h-10 w-10 rounded-full shadow-sm ring-1 ring-gray-300 transition duration-150 ease-in-out active:scale-95 dark:ring-gray-600"
          style={{ backgroundColor: colorSpec.value }}
          onClick={() => {
            if (colorSpecId === undefined) {
              delete UserProductStore.components[componentId].materials[
                materialSpecId
              ];
              return;
            }
            UserProductStore.components[componentId].materials[materialSpecId] =
              colorSpecId;
          }}
          aria-label={`select color ${colorSpec.name}`}
        />
      );
    }
  };

  return (
    <>
      {Object.entries(componentSpec.materialSpecs).map(
        ([materialSpecId, materialSpec], materialIndex) => (
          <div key={materialIndex} className="p-1">
            <h2 className="mt-1 text-sm font-normal">{materialSpec.name}</h2>
            <div className="mt-1 flex flex-wrap justify-center rounded-md p-1 outline outline-1 outline-slate-100 dark:outline-slate-800">
              {colorTile(
                materialSpecId,
                defaultColorSpec,
                undefined,
                "default"
              )}
              {Object.entries(materialSpec.colorVariationsSpecs).map(
                ([colorSpecId, colorSpec], colorIndex) =>
                  colorTile(materialSpecId, colorSpec, colorSpecId, colorIndex)
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};
