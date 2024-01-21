import { useSnapshot } from "valtio";

import { ProductSelectionTile } from "./ProductSelectionTile.tsx";
import { ProductsStore } from "../../../../stores/ProductsStore.ts";
import { ContainerHeader } from "../../universal/ContainerHeader.tsx";

interface ProductSelectionProps {
  onSelect: (productId: string) => void;
}

export const ProductSelection = ({ onSelect }: ProductSelectionProps) => {
  const productsSnap = useSnapshot(ProductsStore);

  return (
    <div className="flex h-full w-full select-none flex-col items-center justify-start overflow-y-scroll bg-white p-4 dark:bg-gray-900">
      <div className="content-width">
        <ContainerHeader title={"Select product"} onClose={undefined} />
        <div className="flex flex-wrap justify-start">
          {Object.keys(productsSnap.products).map((productId, index) => (
            <div
              key={index}
              className="w-full p-2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4"
            >
              <button
                className="w-full rounded-xl outline outline-1 outline-gray-300 transition-all duration-150 ease-in-out hover:bg-gray-100 active:scale-95 active:shadow-inner dark:outline-gray-700 dark:hover:bg-gray-800"
                onClick={() => onSelect(productId)}
              >
                <ProductSelectionTile productId={productId} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
