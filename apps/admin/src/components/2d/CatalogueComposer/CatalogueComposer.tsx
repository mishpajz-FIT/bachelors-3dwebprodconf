import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { Catalogue } from "@3dwebprodconf/shared/src/interfaces/Catalogue.ts";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useState } from "react";
import { useSnapshot } from "valtio";

import { CatalogueComposerTile } from "./CatalogueComposerTile.tsx";
import { exportCatalogue } from "../../../stores/actions/CatalogueActions.ts";
import { CatalogueStore } from "../../../stores/CatalogueStore.ts";
import { AddProduct } from "../Add/subcomponents/AddProduct.tsx";

export const CatalogueComposer = () => {
  const catalogueSnap = useSnapshot(CatalogueStore);

  const [isOpenAdd, setOpenAdd] = useState(false);

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result;
      if (text) {
        const json = JSON.parse(text as string) as Catalogue;

        //TODO: validation

        CatalogueStore.products = {};
        if (json.products) {
          CatalogueStore.products = json.products;
        }
      }
    };
    reader.readAsText(file);
  };

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
          <div className="mt-auto flex flex-row items-center justify-end gap-1">
            <input
              type="file"
              id="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleFileSelection}
            />
            <label htmlFor="file" className="secondary-button">
              Import
            </label>
            <button
              className="primary-button"
              onClick={() => exportCatalogue()}
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <Popup isOpen={isOpenAdd} onClose={() => setOpenAdd(false)}>
        <AddProduct onClose={() => setOpenAdd(false)} />
      </Popup>
    </div>
  );
};
