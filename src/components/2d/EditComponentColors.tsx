import {useSnapshot} from "valtio";

import {ColorSpecification, ComponentSpecification} from "../../interfaces/ProductSpecification.ts";
import {UserProductStore} from "../../stores/UserProductStore.ts";

interface EditComponentColorsProps {
  componentId: string;
  componentSpec: ComponentSpecification;
}

export const EditComponentColors = ({componentId, componentSpec} : EditComponentColorsProps) => {
  const userProductSnap = useSnapshot(UserProductStore);

  const defaultColorSpec: ColorSpecification = {
    colorSpecId: "default",
    name: "Default",
    value: "#ffffff"
  };

  const materials = userProductSnap.components[componentId].materials;

  const colorTile = (materialSpecId: string, colorSpec: ColorSpecification, key?: string | number, isDefault = false) => {
    const isSelected = isDefault
      ? materials[materialSpecId] === undefined
      : materials[materialSpecId] === colorSpec.colorSpecId;

    if (isSelected) {
      return (
        <div
          key={key}
          className="m-1 flex w-full items-center rounded bg-slate-50 outline outline-1 outline-slate-100 dark:bg-slate-800 dark:outline-slate-800"
          aria-label="selected"
        >
          <div
            className="m-2 h-8 w-8 rounded-sm outline outline-2 outline-offset-2"
            style={{backgroundColor: colorSpec.value, outlineColor: colorSpec.value}}
          />
          <span className={"ml-2 truncate text-sm font-light leading-tight text-gray-600 dark:text-gray-400"}>{colorSpec.name}</span>
        </div>
      );
    } else {
      return (
        <button
          key={key}
          className="m-1 h-10 w-10 rounded-full shadow-sm ring-1 ring-gray-300 transition duration-150 ease-in-out active:scale-95 dark:ring-gray-600"
          style={{backgroundColor: colorSpec.value}}
          onClick={() => {
            if (isDefault) {
              delete UserProductStore.components[componentId].materials[materialSpecId];
              return;
            }
            UserProductStore.components[componentId].materials[materialSpecId] = colorSpec.colorSpecId;
          }}
          aria-label={`select color ${colorSpec.name}`}
        />
      );
    }
  };

  return (
    <>
      {componentSpec.materialSpecs.map((materialSpec, materialIndex) => (
        <div key={materialIndex} className="p-1">
          <h2 className="mt-1 text-sm font-normal">{materialSpec.name}</h2>
          <div className="mt-1 flex flex-wrap justify-center rounded-md p-1 outline outline-1 outline-slate-100 dark:outline-slate-800">
            {colorTile(materialSpec.materialSpecId, defaultColorSpec, "default", true)}
            {materialSpec.colorVariationsSpecs.map((colorSpec, colorIndex) =>
              colorTile(materialSpec.materialSpecId, colorSpec, colorIndex)
            )}
          </div>
        </div>
      ))}
    </>);
};
