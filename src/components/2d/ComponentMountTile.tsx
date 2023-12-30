import {InformationCircleIcon} from "@heroicons/react/20/solid";
import {memo, useCallback, useState} from "react";

interface ComponentMountTileProps {
    image: string;
    name: string;
    description: string;
    price: string;
}

export const ComponentMountTile = memo(({image, name, description, price}: ComponentMountTileProps) => {

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  return (
    <div className={`flex h-[150px] w-[350px] shrink-0 select-none rounded-md border border-gray-200 p-4 dark:border-gray-700 ${
      !isButtonHovered ? "transition-all duration-150 ease-in-out hover:bg-gray-100 active:scale-95 active:shadow-inner dark:hover:bg-gray-800" : ""}`}>
      {!imageError && (
        <div className="pointer-events-none mr-4 h-24 w-24 shrink-0">
          <img
            src={image}
            alt={name}
            className={`rounded transition-all duration-300 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'} h-full w-full object-cover`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}
      {!imageLoaded && !imageError && <div className="mr-4 h-24 w-24 shrink-0 animate-pulse rounded bg-gray-300" />}
      <div className="flex flex-col justify-between overflow-hidden">
        <div className="mb-1">
          <h2 className="truncate text-lg font-semibold">{name}</h2>
          <p className="line-clamp-3 text-pretty text-sm leading-tight text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="mt-1 flex flex-row items-center justify-between">
          <span className="text-sm font-light">{price}</span>
          <button
            className="other-button"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}>
            <InformationCircleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

ComponentMountTile.displayName = "ComponentMountTile";
