import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSnapshot } from "valtio";

import { CatalogueComposerButtons } from "./subcomponents/CatalogueComposerButtons.tsx";
import { CatalogueComposerTile } from "./subcomponents/CatalogueComposerTile.tsx";
import { CatalogueStore } from "../../../stores/CatalogueStore.ts";
import { AddProduct } from "../../panels/Add/subcomponents/AddProduct.tsx";

export const CatalogueComposer = () => {
  const catalogueSnap = useSnapshot(CatalogueStore);

  const [isOpenAdd, setOpenAdd] = useState(false);

  return (
    <div className="content-background flex size-full select-none flex-col items-center justify-start overflow-y-scroll p-4">
      <div className="content-width flex h-full flex-row justify-center">
        <div className="flex size-full flex-col lg:w-2/3">
          <div className="flex flex-row items-center justify-between">
            <ContainerHeader title={"Catalogue"} />
            <button
              className="secondary-button"
              onClick={() => setOpenAdd(true)}
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
          <ul className="mb-2 w-full overflow-y-scroll p-2">
            {Object.keys(catalogueSnap.products).length === 0 ? (
              <li className="pointer-events-none select-none p-4 text-center text-sm text-gray-900 dark:text-gray-400">
                No products
              </li>
            ) : (
              Object.keys(catalogueSnap.products).map((productId) => (
                <li key={productId} className="mt-2">
                  <CatalogueComposerTile productId={productId} />
                </li>
              ))
            )}
          </ul>
          <CatalogueComposerButtons />
        </div>

        <Popup isOpen={isOpenAdd} onClose={() => setOpenAdd(false)}>
          <AddProduct onClose={() => setOpenAdd(false)} />
        </Popup>
      </div>
    </div>
  );
};
