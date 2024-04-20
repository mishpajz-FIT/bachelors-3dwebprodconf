import { Combobox, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useGLTF } from "@react-three/drei";
import { Fragment, useState } from "react";

import { useSelectedComponentSpec } from "../../../../../hooks/useSelectedComponentSpec.ts";
import { useSelectedMaterialSpec } from "../../../../../hooks/useSelectedMaterialSpec.ts";
import { ProductActions } from "../../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";

export const EditMaterialSpecificationModels = () => {
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();
  const { materialSpecId, materialSpec } = useSelectedMaterialSpec();

  const { materials } = useGLTF(componentSpec.modelUrl);

  const [searchTerm, setSearchTerm] = useState("");

  const [addedModelMaterial, setAddedModelMaterial] = useState("");
  const [addTerm, setAddTerm] = useState("");

  const filteredMaterials = materialSpec.modelMaterials.filter((materialName) =>
    materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAddModelMaterial = Object.keys(materials).filter(
    (objectMaterial) => {
      const isIncluded = objectMaterial
        .toLowerCase()
        .includes(addTerm.toLowerCase());
      const isAdded = materialSpec.modelMaterials.includes(componentSpecId);

      return isIncluded && !isAdded;
    }
  );

  return (
    <div>
      <h3 className="section-heading-aligned">Included Model Materials</h3>
      <div className="mx-4 rounded-md bg-slate-50 p-1 outline outline-1 outline-slate-100 dark:bg-zinc-800 dark:outline-zinc-800">
        <form
          className="m-1"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="model-materials-search" className="sr-only">
            Search included model materials
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <MagnifyingGlassIcon className="size-4" />
            </div>
            <input
              type="search"
              id="model-materials-search"
              className="field block w-full bg-transparent ps-10"
              placeholder="Search included model materials..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </form>
        <ul className="flex max-h-48 min-h-24 shrink-0 flex-col items-center justify-start overflow-x-clip overflow-y-scroll overscroll-y-contain p-2">
          {filteredMaterials.length === 0 ? (
            <li className="p-4 text-center text-sm text-gray-900 dark:text-gray-400">
              No included materials
            </li>
          ) : (
            filteredMaterials.map((includedMaterialName) => (
              <li
                key={includedMaterialName}
                className="tile-background underlined-selection m-1 w-full rounded-lg underline"
              >
                <div className="flex w-full flex-row items-center justify-between p-2">
                  <span className="w-full text-wrap font-mono text-sm font-semibold slashed-zero tabular-nums tracking-tight text-black dark:text-gray-200">
                    {includedMaterialName}
                  </span>
                  <button
                    className="other-button p-1"
                    onClick={() => {
                      const editableMaterial = ProductActions.getMaterialSpec(
                        ProductActions.getComponentSpec(
                          componentSpecId,
                          ProductStore
                        ),
                        materialSpecId
                      );

                      const index = editableMaterial.modelMaterials.indexOf(
                        includedMaterialName,
                        0
                      );
                      if (index > -1) {
                        editableMaterial.modelMaterials.splice(index, 1);
                      }
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
          <div className="w-full px-1 pb-1 pt-2">
            <Combobox
              value={addedModelMaterial}
              onChange={(value: string) => {
                ProductActions.getMaterialSpec(
                  ProductActions.getComponentSpec(
                    componentSpecId,
                    ProductStore
                  ),
                  materialSpecId
                ).modelMaterials.push(value);
                setAddedModelMaterial("");
              }}
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                  <PlusIcon className="size-4" />
                </div>
                <Combobox.Input
                  className="field block w-full bg-transparent ps-10"
                  placeholder={"Include model material..."}
                  onChange={(event) => setAddTerm(event.target.value)}
                />
                <Combobox.Button className="absolute inset-y-0 end-0 flex items-center pe-1">
                  <ChevronUpDownIcon
                    className="size-4 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setAddTerm("")}
              >
                <Combobox.Options className="field absolute z-20 mt-1 max-h-60 w-72 overflow-auto">
                  {filteredAddModelMaterial.length === 0 && addTerm !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-center text-sm text-gray-900 dark:text-gray-400">
                      Nothing found.
                    </div>
                  ) : (
                    filteredAddModelMaterial.map((modelMaterialName) => (
                      <Combobox.Option
                        key={modelMaterialName}
                        className={({ active }) =>
                          `relative cursor-default select-none p-2 ${
                            active ? "font-bold" : ""
                          }`
                        }
                        value={modelMaterialName}
                      >
                        <span className={"block truncate"}>
                          {modelMaterialName}
                        </span>
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </Combobox>
          </div>
        </div>
      </div>
    </div>
  );
};
