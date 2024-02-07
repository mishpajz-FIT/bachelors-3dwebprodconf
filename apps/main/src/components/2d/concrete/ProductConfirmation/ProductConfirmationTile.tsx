import { useSnapshot } from "valtio";

import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../stores/UserCreationStore.ts";
import { SkeletonImage } from "../../universal/SkeletonImage.tsx";

interface ProductConfirmationTileProps {
  componentId: string;
}

export const ProductConfirmationTile = ({
  componentId,
}: ProductConfirmationTileProps) => {
  const userCreationSnap = useSnapshot(UserCreationStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const component = userCreationSnap.components[componentId];
  if (!component) {
    throw new Error(`Component ${componentId} not found`);
  }

  const componentSpec =
    productSpecsSnap.componentSpecs[component.componentSpec];
  if (!componentSpec) {
    throw new Error(
      `Component specification ${component.componentSpec} not found`
    );
  }

  return (
    <div
      className={`flex flex-col p-4 ${Object.entries(component.materials).length > 0 && "gap-4"}`}
    >
      <div className="flex flex-row items-center">
        <SkeletonImage
          src={componentSpec.imageUrl}
          alt={componentSpec.name}
          className="pointer-events-none inset-1 size-16 rounded"
        />

        <div className="ml-2 grow">
          <p className="truncate text-lg font-semibold">{componentSpec.name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-0">
        {Object.entries(component.materials).map(
          ([materialId, colorSpecId]) => {
            const material = componentSpec.materialSpecs[materialId];
            if (!material) {
              throw new Error(`Material ${materialId} not found`);
            }

            const colorSpec = material.colorVariationsSpecs[colorSpecId];
            if (!colorSpec) {
              throw new Error(`Color ${colorSpecId} not found`);
            }

            return (
              <div
                className="flex flex-col rounded-md bg-gray-50 px-2 pb-2 pt-1 dark:bg-zinc-800"
                key={materialId}
              >
                <h2 className="pb-1 text-sm font-normal">{material.name}</h2>
                <div className="flex flex-row items-center">
                  <div
                    className="size-10 rounded shadow-sm ring-1 ring-gray-300 dark:ring-gray-600"
                    style={{
                      backgroundColor: colorSpec.value,
                    }}
                  />

                  <span className="ml-2 select-none truncate text-sm font-light leading-tight text-gray-600 dark:text-gray-400">
                    {colorSpec.name}
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
