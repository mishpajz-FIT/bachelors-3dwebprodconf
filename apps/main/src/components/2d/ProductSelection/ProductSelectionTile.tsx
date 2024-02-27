import { SkeletonImage } from "@3dwebprodconf/shared/src/components/SkeletonImage.tsx";
import { useSnapshot } from "valtio";

import { CatalogueStore } from "../../../stores/CatalogueStore.ts";

interface ProductSelectionTileProps {
  productId: string;
}

export const ProductSelectionTile = ({
  productId,
}: ProductSelectionTileProps) => {
  const catalogueSnap = useSnapshot(CatalogueStore);

  const product = catalogueSnap.catalogue.products[productId];
  if (!product) {
    throw new Error(`Product with id ${productId} not found`);
  }

  return (
    <div className="flex flex-row items-center justify-start p-4">
      <SkeletonImage
        src={product.imageUrl}
        alt={product.name}
        className="pointer-events-none inset-1 size-24 rounded"
      />

      <div className="ml-4 grow">
        <p className="truncate text-left text-lg font-semibold">
          {product.name}
        </p>
      </div>
    </div>
  );
};
