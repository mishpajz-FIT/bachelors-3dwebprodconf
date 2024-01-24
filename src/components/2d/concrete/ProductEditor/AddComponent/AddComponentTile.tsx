import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { memo, useState } from "react";
import { useSnapshot } from "valtio";

import { ProductSpecificationStore } from "../../../../../stores/ProductSpecificationStore.ts";
import { SkeletonImage } from "../../../universal/SkeletonImage.tsx";

interface AddComponentTileProps {
  componentSpecId: string;
  add: () => void;
}

export const AddComponentTile = memo(
  ({ componentSpecId, add }: AddComponentTileProps) => {
    const productSpecsSnap = useSnapshot(ProductSpecificationStore);

    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];
    if (!componentSpec) {
      throw new Error(`Component specification ${componentSpecId} not found`);
    }

    //TODO: create component details

    return (
      <div
        role={"button"}
        tabIndex={0}
        className={`tile-background flex h-full w-full shrink-0 select-none flex-row justify-start overflow-hidden rounded-md p-4 text-left ${
          !isButtonHovered ? "tile-pressable" : ""
        }`}
        onClick={add}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            add();
          }
        }}
      >
        <SkeletonImage
          src={componentSpec.imageUrl}
          alt={componentSpec.name}
          className="pointer-events-none inset-1 mr-4 h-24 w-24 rounded"
        />
        <div className="flex w-full flex-col justify-between overflow-hidden">
          <div className="mb-1">
            <h2 className="truncate text-lg font-semibold">
              {componentSpec.name}
            </h2>
            <p className="line-clamp-3 overflow-y-hidden text-pretty text-sm leading-tight text-gray-600 dark:text-gray-400">
              {componentSpec.description}
            </p>
          </div>
          <div className="mt-1 flex shrink-0 flex-row items-center justify-between">
            <span className="text-sm font-light">{componentSpec.price}</span>
            <button
              className="other-button"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <InformationCircleIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

AddComponentTile.displayName = "ComponentMountTile";
