import {InformationCircleIcon} from "@heroicons/react/20/solid";
import {memo, useCallback, useState} from "react";
import {useSnapshot} from "valtio";

import {ProductOptionsStore} from "../../stores/ProductOptionsStore.ts";

interface ComponentMountTileProps {
  componentProductId: string
  add: () => void
}

export const ComponentMountTile = memo(({componentProductId, add}: ComponentMountTileProps) => {
  const productOptionsSnap = useSnapshot(ProductOptionsStore);

  const component = productOptionsSnap.components.get(componentProductId);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  if(productOptionsSnap.isLoading) {
    return null;
  }

  if (!component) {
    //TODO: handle missing component
    throw new Error("User component not found");
  }

  //TODO: create component details

  //TODO: use suspense
  return (
    <div
      className={`flex h-[150px] w-[350px] shrink-0 select-none justify-start rounded-md border border-gray-200 p-4 dark:border-gray-700 ${
        !isButtonHovered ? "transition-all duration-150 ease-in-out hover:bg-gray-100 active:scale-95 active:shadow-inner dark:hover:bg-gray-800" : ""}`}
      onClick={add}>
      {!imageError && (
        <div className="pointer-events-none mr-4 h-24 w-24 shrink-0">
          <img
            src={component.imageUrl}
            alt={component.name}
            className={`rounded transition-all duration-300 ease-in-out ${imageLoaded ? "opacity-100" : "opacity-0"} h-full w-full object-cover`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}
      {(!imageLoaded || imageError) && <div className={`mr-4 h-24 w-24 shrink-0 ${!imageError ? "animate-pulse" : ""} rounded bg-gray-300`} />}
      <div className="flex w-full flex-col justify-between overflow-hidden">
        <div className="mb-1">
          <h2 className="truncate text-lg font-semibold">{component.name}</h2>
          <p className="line-clamp-3 text-pretty text-sm leading-tight text-gray-600 dark:text-gray-400">{component.description}</p>
        </div>
        <div className="mt-1 flex flex-row items-center justify-between">
          <span className="text-sm font-light">{component.price}</span>
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
