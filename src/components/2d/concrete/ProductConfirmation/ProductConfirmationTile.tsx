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
    <div className="flex flex-row">
      <SkeletonImage
        src={componentSpec.imageUrl}
        alt={componentSpec.name}
        className="pointer-events-none inset-1 h-20 w-20 rounded"
      />

      <div className="mb-1 grow">
        <h2 className="truncate text-lg font-semibold">{componentSpec.name}</h2>
      </div>
    </div>
  );
};
