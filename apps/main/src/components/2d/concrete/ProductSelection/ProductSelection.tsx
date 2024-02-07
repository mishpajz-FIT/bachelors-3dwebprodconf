import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { ProductSelectionTile } from "./ProductSelectionTile.tsx";
import { ProductsStore } from "../../../../stores/ProductsStore.ts";
import { ContainerHeader } from "../../universal/ContainerHeader.tsx";

export const ProductSelection = () => {
  const navigate = useNavigate();

  const productsSnap = useSnapshot(ProductsStore);

  const Skeleton = () => {
    return (
      <div className="flex flex-wrap justify-start">
        {Array.from(Array(4).keys()).map((_, index) => (
          <div
            key={index}
            className="h-[160px] w-full p-2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4"
          >
            <div className="size-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="content-background flex size-full select-none flex-col items-center justify-start overflow-y-scroll p-4">
      <div className="content-width">
        <ContainerHeader title={"Select product"} onClose={undefined} />
        <Suspense fallback={<Skeleton />}>
          <div className="flex flex-wrap justify-start">
            {Object.keys(productsSnap.products).map((productId, index) => (
              <div
                key={index}
                className="w-full p-2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4"
              >
                <button
                  className="tile w-full"
                  onClick={() => {
                    navigate("/" + productId + "/editor");
                  }}
                >
                  <ProductSelectionTile productId={productId} />
                </button>
              </div>
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
};
