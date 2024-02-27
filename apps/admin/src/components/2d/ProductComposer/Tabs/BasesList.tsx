import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSnapshot } from "valtio";

import { ProductStore } from "../../../../stores/ProductStore.ts";
import { AddBase } from "../../Add/subcomponents/AddBase.tsx";

export const BasesList = () => {
  const productSnap = useSnapshot(ProductStore);

  const [isOpenAdd, setOpenAdd] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBases = Object.keys(productSnap.baseSpecs).filter((baseId) =>
    baseId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mt-6 flex flex-row gap-2">
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="base-search" className="sr-only">
            Search bases
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <MagnifyingGlassIcon className="size-4" />
            </div>
            <input
              type="search"
              id="base-search"
              className="field block w-full bg-transparent ps-10"
              placeholder="Search bases..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </form>

        <button
          className="secondary-button px-3.5"
          onClick={() => setOpenAdd(true)}
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
      <ul className="mt-4">
        {filteredBases.length === 0 ? (
          <li className="pointer-events-none select-none  p-4 text-center text-sm text-gray-900 dark:text-gray-400">
            No bases
          </li>
        ) : (
          filteredBases.map((baseId) => (
            <li
              key={baseId}
              className="tile-background m-2 rounded-lg border-2 border-transparent"
            >
              <div>
                <div className="flex flex-col items-center justify-start gap-2 p-2 slashed-zero tabular-nums tracking-tight text-black dark:text-gray-200">
                  <span className="w-full text-wrap font-mono text-sm font-semibold">
                    {baseId}
                  </span>
                  <span className="w-full text-wrap font-mono text-xs font-thin">
                    {productSnap.baseSpecs[baseId].component}
                  </span>
                  <div className="flex w-full flex-row items-center justify-end">
                    <button
                      className="other-button p-1"
                      onClick={() => {
                        delete ProductStore.baseSpecs[baseId];
                      }}
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      <Popup isOpen={isOpenAdd} onClose={() => setOpenAdd(false)}>
        <AddBase onClose={() => setOpenAdd(false)} />
      </Popup>
    </div>
  );
};
