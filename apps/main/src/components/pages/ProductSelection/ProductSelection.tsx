import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { ProductSelectionSkeleton } from "./subcomponents/ProductSelectionSkeleton.tsx";
import { ProductSelectionTile } from "./subcomponents/ProductSelectionTile.tsx";
import { CatalogueStore } from "../../../stores/CatalogueStore.ts";

export const ProductSelection = () => {
  const navigate = useNavigate();

  const catalogueSnap = useSnapshot(CatalogueStore);
  return (
    <div className="content-background flex min-h-fit shrink grow select-none flex-col items-center justify-start overflow-y-scroll p-4">
      <div className="content-width">
        <ContainerHeader title={"Select product"} onClose={undefined} />
        <Suspense fallback={<ProductSelectionSkeleton />}>
          <div className="flex flex-wrap justify-start">
            {catalogueSnap.catalogue &&
              Object.keys(catalogueSnap.catalogue.products).map((productId) => (
                <div
                  key={productId}
                  className="min-h-56 w-full p-2 md:w-1/2 lg:w-1/3 xl:w-1/3 2xl:w-1/3"
                >
                  <button
                    className="tile size-full"
                    onClick={() => {
                      navigate("/editor/" + productId);
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
