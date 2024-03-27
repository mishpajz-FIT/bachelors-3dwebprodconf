import { SkeletonImage } from "@3dwebprodconf/shared/src/components/SkeletonImage.tsx";

import { useComponent } from "../../../../hooks/useComponent.ts";
import { useTranslation } from "react-i18next";

interface ProductConfirmationTileProps {
  componentId: string;
}

export const ProductConfirmationTile = ({
  componentId,
}: ProductConfirmationTileProps) => {
  const { t } = useTranslation();

  const { component, componentSpec } = useComponent(componentId);

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
              throw new Error(
                t("errorMissingMaterial", { materialId: materialId })
              );
            }

            const colorSpec = material.colorVariationsSpecs[colorSpecId];
            if (!colorSpec) {
              throw new Error(t("errorMissingColor", { colorId: colorSpecId }));
            }

            return (
              <div
                className="flex flex-col rounded-md bg-gray-50 px-2 pb-2 pt-1 dark:bg-zinc-800"
                key={materialId}
              >
                <h2 className="label pb-1">{material.name}</h2>
                <div className="flex flex-row items-center">
                  <div
                    className="size-10 rounded shadow-sm ring-1 ring-gray-300 dark:ring-gray-600"
                    style={{
                      backgroundColor: colorSpec.value,
                    }}
                  />

                  <span className="ml-2 select-none truncate text-sm leading-tight text-gray-700 dark:text-gray-400">
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
