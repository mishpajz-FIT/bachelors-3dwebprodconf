import { SkeletonImage } from "@3dwebprodconf/shared/src/components/SkeletonImage.tsx";
import { useSnapshot } from "valtio";

import { CatalogueStore } from "../../../../stores/CatalogueStore.ts";

interface ProductSelectionTileProps {
  productId: string;
}

export const ProductSelectionTile = ({
  productId,
}: ProductSelectionTileProps) => {
  const catalogueSnap = useSnapshot(CatalogueStore);
  if (!catalogueSnap.catalogue) {
    throw new Error(`No catalogue found.`);
  }

  const product = catalogueSnap.catalogue.products[productId];
  if (!product) {
    throw new Error(`Product with id ${productId} not found in catalogue.`);
  }

  return (
    <div className="flex flex-col items-center justify-start p-4">
      <SkeletonImage
        src={product.imageUrl}
        alt={product.name}
        className="pointer-events-none inset-1 size-24 rounded"
      />

      <div className="mt-4 grow">
        <p className="truncate text-center text-lg font-semibold">
          {product.name}
        </p>
      </div>
    </div>
  );
};
