import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { TextInput } from "@3dwebprodconf/shared/src/components/inputs/TextInput.tsx";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

import { useSelectedComponentSpec } from "../../../../../../hooks/useSelectedComponentSpec.ts";
import { useSelectedMaterialSpec } from "../../../../../../hooks/useSelectedMaterialSpec.ts";
import { ProductStore } from "../../../../../../stores/ProductStore.ts";
import { AddColor } from "../../../../Add/subcomponents/AddColor.tsx";

export const EditMaterialSpecificationColors = () => {
  const { componentSpecId } = useSelectedComponentSpec();
  const { materialSpecId, materialSpec } = useSelectedMaterialSpec();

  const [searchTerm, setSearchTerm] = useState("");

  const [isOpenAdd, setOpenAdd] = useState(false);

  const filteredColors = Object.entries(
    materialSpec.colorVariationsSpecs
  ).filter(([colorSpecId]) =>
    colorSpecId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3 className="section-heading">Colors</h3>
      <div className="mx-4 rounded-md bg-slate-50 p-1 outline outline-1 outline-slate-100 dark:bg-zinc-800 dark:outline-zinc-800">
        <form
          className="m-1"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="color-search" className="sr-only">
            Search colors
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <MagnifyingGlassIcon className="size-4" />
            </div>
            <input
              type="search"
              id="color-search"
              className="field block w-full bg-transparent ps-10"
              placeholder="Search colors..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </form>
        <ul className="flex max-h-60 min-h-36 shrink-0 flex-col items-center justify-start overflow-x-clip overflow-y-scroll overscroll-y-contain p-2">
          {filteredColors.length === 0 ? (
            <li className="p-4 text-center text-sm text-gray-900 dark:text-gray-400">
              No colors
            </li>
          ) : (
            filteredColors.map(([colorSpecId, colorSpec]) => (
              <li
                key={colorSpecId}
                className="tile-background m-1 flex w-full flex-col gap-4 rounded-lg p-2"
              >
                <span className="mt-1 w-full text-wrap font-mono text-sm font-semibold slashed-zero tabular-nums tracking-tight text-black dark:text-gray-200">
                  {colorSpecId}
                </span>
                <label htmlFor={"color-name"}>
                  <span className="label text-xs">Name</span>
                  <TextInput
                    submitValue={(value) => {
                      const editableMaterial =
                        ProductStore.componentSpecs[componentSpecId]
                          .materialSpecs[materialSpecId];
                      const editableColor =
                        editableMaterial.colorVariationsSpecs[colorSpecId];
                      editableColor.name = value;
                    }}
                    allowEmpty={false}
                    placeholder={"Crimson red"}
                    currentValue={colorSpec.name}
                    inputId={"color-name"}
                  />
                </label>
                <label>
                  <span className="label  text-xs">Value</span>
                  <input
                    type="color"
                    name="value"
                    className="block h-10 w-14 cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-1 focus:border-[var(--primary-light)] focus:ring-[var(--primary-light)] dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-[var(--primary-dark)] dark:focus:ring-[var(--primary-dark)]"
                    value={colorSpec.value}
                    onChange={(e) => {
                      const editableMaterial =
                        ProductStore.componentSpecs[componentSpecId]
                          .materialSpecs[materialSpecId];
                      const editableColor =
                        editableMaterial.colorVariationsSpecs[colorSpecId];
                      editableColor.value = e.target.value;
                    }}
                    required={true}
                  />
                </label>
                <div className="flex flex-row items-center justify-end">
                  <button
                    className="other-button w-6 p-1"
                    onClick={() => {
                      const editableMaterial =
                        ProductStore.componentSpecs[componentSpecId]
                          .materialSpecs[materialSpecId];

                      delete editableMaterial.colorVariationsSpecs[colorSpecId];
                    }}
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="flex w-full flex-row justify-end border-t border-gray-300 dark:border-zinc-700">
          <button
            className="other-button mt-1 p-1"
            onClick={() => setOpenAdd(true)}
          >
            <PlusIcon className="size-4" />
          </button>
          <Popup isOpen={isOpenAdd} onClose={() => setOpenAdd(false)}>
            <AddColor onClose={() => setOpenAdd(false)} />
          </Popup>
        </div>
      </div>
    </div>
  );
};
