import { useSnapshot } from "valtio";

import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { UserProductStore } from "../../../../stores/UserProductStore.ts";
import { SkeletonImage } from "../../universal/SkeletonImage.tsx";

interface ProductConfirmationTileProps {
  componentId: string;
}

export const ProductConfirmationTile = ({
  componentId,
}: ProductConfirmationTileProps) => {
  const userProductSnap = useSnapshot(UserProductStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  if (productSpecsSnap.isLoading) {
    return null;
  }

  const component = userProductSnap.components[componentId];
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
    <div className="flex flex-col p-4">
      <div className="mb-2 flex flex-row items-center">
        <SkeletonImage
          src={componentSpec.imageUrl}
          alt={componentSpec.name}
          className="pointer-events-none inset-1 h-16 w-16 rounded"
        />

        <div className="ml-2 grow">
          <h2 className="truncate text-lg font-semibold">
            {componentSpec.name}
          </h2>
        </div>
      </div>

      {Object.entries(component.materials).map(([materialId, colorSpecId]) => {
        const material = componentSpec.materialSpecs[materialId];
        if (!material) {
          throw new Error(`Material ${materialId} not found`);
        }

        const colorSpec = material.colorVariationsSpecs[colorSpecId];
        if (!colorSpec) {
          throw new Error(`Color ${colorSpecId} not found`);
        }

        return (
          <div className="flex flex-col p-1" key={materialId}>
            <h2 className="text-sm font-normal">{material.name}</h2>
            <div className="flex flex-row items-center p-1">
              <div
                className="h-10 w-10 rounded shadow-sm ring-1 ring-gray-300 dark:ring-gray-600"
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
      })}
    </div>
  );
};
