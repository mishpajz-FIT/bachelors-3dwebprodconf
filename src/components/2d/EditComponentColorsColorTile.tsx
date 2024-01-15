import { useSnapshot } from "valtio";

import { ColorSpecification } from "../../interfaces/ProductSpecification.ts";
import { UserProductStore } from "../../stores/UserProductStore.ts";

interface EditComponentColorsColorTileProps {
  componentId: string;
  materialSpecId: string;
  colorSpec: ColorSpecification;
  colorSpecId?: string;
  key?: string | number;
}
export const EditComponentColorsColorTile = ({
  componentId,
  materialSpecId,
  colorSpec,
  colorSpecId,
  key,
}: EditComponentColorsColorTileProps) => {
  const userProductSnap = useSnapshot(UserProductStore);

  const materials = userProductSnap.components[componentId].materials;
  const isSelected = materials[materialSpecId] === colorSpecId;

  const select = () => {
    if (colorSpecId === undefined) {
      delete UserProductStore.components[componentId].materials[materialSpecId];
      return;
    }
    UserProductStore.components[componentId].materials[materialSpecId] =
      colorSpecId;
  };

  return (
    <div
      key={key}
      className={`flex items-center ${isSelected ? "m-1 w-full" : "w-12"}`}
      aria-label={`${isSelected ? "selected" : "select"}`}
    >
      <div
        className={`flex items-center transition-[width] duration-500 ease-in-out ${isSelected ? "w-full rounded bg-slate-50 outline outline-1 outline-slate-100 dark:bg-slate-800 dark:outline-slate-800" : "w-12"}`}
      >
        <button
          className={`min-w-8 transition-[outline] duration-150 ${
            isSelected
              ? "m-2 h-8 w-8 rounded-sm outline outline-2 outline-offset-2"
              : "m-1 h-10 w-10 rounded-full shadow-sm ring-1 ring-gray-300 transition duration-150 ease-in-out hover:rounded-md active:scale-95 dark:ring-gray-600"
          }`}
          style={{
            backgroundColor: colorSpec.value,
            outlineColor: colorSpec.value,
          }}
          onClick={isSelected ? undefined : select}
          disabled={isSelected}
        />
        <span
          hidden={!isSelected}
          className="ml-2 select-none truncate text-sm font-light leading-tight text-gray-600 dark:text-gray-400"
        >
          {colorSpec.name}
        </span>
      </div>
    </div>
  );
};
