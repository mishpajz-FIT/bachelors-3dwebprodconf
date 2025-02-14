import { ColorSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { useSnapshot } from "valtio";

import { UserCreationActions } from "../../../../../stores/actions/UserCreationActions.ts";
import { ProductSpecificationStore } from "../../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../../stores/UserCreationStore.ts";

interface EditComponentColorsColorTileProps {
  componentId: string;
  materialSpecId: string;
  colorSpec: ColorSpecification;
  colorSpecId?: string;
}
export const EditComponentColorsColorTile = ({
  componentId,
  materialSpecId,
  colorSpec,
  colorSpecId,
}: EditComponentColorsColorTileProps) => {
  const userCreationSnap = useSnapshot(UserCreationStore);

  const materials = userCreationSnap.value.components[componentId].materials;
  const isSelected = materials[materialSpecId] === colorSpecId;

  return (
    <div
      className={`flex items-center ${isSelected ? "m-1 w-full" : "w-12"}`}
      aria-label={`${isSelected ? "selected" : "select"}`}
    >
      <div
        className={`flex items-center transition-[width] duration-500 ease-in-out ${isSelected ? "w-full rounded bg-slate-50 outline outline-1 outline-slate-100 dark:bg-zinc-800 dark:outline-zinc-800" : "w-12"}`}
      >
        <button
          className={`min-w-8 transition-[outline] duration-150 ${
            isSelected
              ? "m-2 size-8 rounded-sm outline outline-2 outline-offset-2"
              : "m-1 size-10 rounded-full shadow-sm ring-1 ring-gray-300 transition duration-150 ease-in-out hover:rounded-md active:scale-95 dark:ring-gray-600"
          }`}
          style={{
            backgroundColor: colorSpec.value,
            outlineColor: colorSpec.value,
          }}
          onClick={
            isSelected
              ? undefined
              : () => {
                  UserCreationActions.changeMaterialColor(
                    componentId,
                    materialSpecId,
                    colorSpecId,
                    UserCreationStore.value,
                    ProductSpecificationStore
                  );
                }
          }
          disabled={isSelected}
        />
        <span
          hidden={!isSelected}
          className="ml-2 select-none truncate text-sm leading-tight text-gray-700 dark:text-gray-400"
        >
          {colorSpec.name}
        </span>
      </div>
    </div>
  );
};
