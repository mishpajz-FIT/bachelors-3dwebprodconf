import { SkeletonImage } from "@3dwebprodconf/shared/src/components/SkeletonImage.tsx";

import { useComponentSpec } from "../../../../../hooks/useComponentSpec.ts";

interface AddComponentTileProps {
  componentSpecId: string;
  onAdd: () => void;
  disabled: boolean;
}

export const AddComponentTile = ({
  componentSpecId,
  onAdd,
  disabled = false,
}: AddComponentTileProps) => {
  //const [isButtonHovered, setIsButtonHovered] = useState(false);
  const isButtonHovered = false;

  const componentSpec = useComponentSpec(componentSpecId);

  return (
    <div
      role={"button"}
      tabIndex={0}
      className={`tile-background flex size-full shrink-0 select-none flex-row justify-start overflow-hidden rounded-md p-4 text-left ${
        !isButtonHovered && !disabled ? "tile-pressable" : ""
      } ${disabled && "cursor-not-allowed opacity-30"}`}
      onClick={disabled ? undefined : onAdd}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (disabled) {
          return;
        }

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
          {/*<button
            className="other-button"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <InformationCircleIcon className="size-4" />
          </button>*/}
        </div>
      </div>
    </div>
  );
};
