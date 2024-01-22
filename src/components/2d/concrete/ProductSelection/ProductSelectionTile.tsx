import { useSnapshot } from "valtio";

import { ProductsStore } from "../../../../stores/ProductsStore";
import { SkeletonImage } from "../../universal/SkeletonImage";

interface ProductSelectionTileProps {
  productId: string;
}

export const ProductSelectionTile = ({
  productId,
}: ProductSelectionTileProps) => {
  const productsSnap = useSnapshot(ProductsStore);

  const product = productsSnap.products[productId];
  if (!product) {
    throw new Error(`Product with id ${productId} not found`);
  }

  return (
    <div className="flex flex-row items-center justify-start p-4">
      <SkeletonImage
        src={product.imageUrl}
        alt={product.name}
        className="pointer-events-none inset-1 h-24 w-24 rounded"
      />

      <div className="ml-4 grow">
        <p className="truncate text-left text-lg font-semibold">
          {product.name}
        </p>
      </div>
    </div>
  );
};
