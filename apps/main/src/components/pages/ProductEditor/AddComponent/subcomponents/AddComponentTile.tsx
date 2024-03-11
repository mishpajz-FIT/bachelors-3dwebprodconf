import { SkeletonImage } from "@3dwebprodconf/shared/src/components/SkeletonImage.tsx";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

import { useComponentSpec } from "../../../../../hooks/useComponentSpec.ts";

interface AddComponentTileProps {
  componentSpecId: string;
  onAdd: () => void;
}

export const AddComponentTile = ({
  componentSpecId,
  onAdd,
}: AddComponentTileProps) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const componentSpec = useComponentSpec(componentSpecId);

  //TODO: create component details

  return (
    <div
      role={"button"}
      tabIndex={0}
      className={`tile-background flex size-full shrink-0 select-none flex-row justify-start overflow-hidden rounded-md p-4 text-left ${
        !isButtonHovered ? "tile-pressable" : ""
      }`}
      onClick={onAdd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAdd();
        }
      }}
    >
      <SkeletonImage
        src={componentSpec.imageUrl}
        alt={componentSpec.name}
        className="pointer-events-none inset-1 mr-4 size-24 rounded"
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
            <InformationCircleIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
