import { Combobox, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";
import { useSnapshot } from "valtio";

import { useSelectedComponentSpec } from "../../../../../../hooks/useSelectedComponentSpec.ts";
import { useSelectedMountingPointSpec } from "../../../../../../hooks/useSelectedMountingPointSpec.ts";
import { EditorValuesStore } from "../../../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../../../stores/ProductStore.ts";

export const EditMountingPointSpecificationComponents = () => {
  const productSnap = useSnapshot(ProductStore);
  const { componentSpecId } = useSelectedComponentSpec();
  const { mountingPointSpecId, mountingPointSpec } =
    useSelectedMountingPointSpec();

  const [searchTerm, setSearchTerm] = useState("");

  const [addedComponent, setAddedComponent] = useState("");
  const [addTerm, setAddTerm] = useState("");

  const filteredComponents = mountingPointSpec.mountableComponents.filter(
    (componentSpecId) =>
      componentSpecId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAddComponent = Object.keys(productSnap.componentSpecs).filter(
    (componentSpecId) => {
      const isIncluded = componentSpecId
        .toLowerCase()
        .includes(addTerm.toLowerCase());
      const isAdded =
        mountingPointSpec.mountableComponents.includes(componentSpecId);

      return isIncluded && !isAdded;
    }
  );

  return (
    <div>
      <h3 className="section-heading">Mountable Components</h3>
      <div className="mx-4 rounded-md bg-slate-50 p-1 outline outline-1 outline-slate-100 dark:bg-zinc-800 dark:outline-zinc-800">
        <form
          className="m-1"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="mounted-component-search" className="sr-only">
            Search mountable components
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <MagnifyingGlassIcon className="size-4" />
            </div>
            <input
              type="search"
              id="mounted-component-search"
              className="field block w-full bg-transparent ps-10"
              placeholder="Search mountable components..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </form>
        <ul className="flex max-h-48 min-h-24 shrink-0 flex-col items-center justify-start overflow-x-clip overflow-y-scroll overscroll-y-contain p-2">
          {filteredComponents.length === 0 ? (
            <li className="p-4 text-center text-sm text-gray-900 dark:text-gray-400">
              No mountable components
            </li>
          ) : (
            filteredComponents.map((mountableComponentId) => (
              <li
                key={mountableComponentId}
                className="tile-background underlined-selection m-1 w-full rounded-lg"
                onMouseEnter={() => {
                  EditorValuesStore.previewedMountedComponent =
                    mountableComponentId;
                }}
                onMouseLeave={() => {
                  EditorValuesStore.previewedMountedComponent = undefined;
                }}
              >
                <div className="flex w-full flex-row items-center justify-between p-2">
                  <span className="w-full text-wrap font-mono text-sm font-semibold slashed-zero tabular-nums tracking-tight text-black dark:text-gray-200">
                    {mountableComponentId}
                  </span>
                  <button
                    className="other-button p-1"
                    onClick={() => {
                      const editableMountingPoint =
                        ProductStore.componentSpecs[componentSpecId]
                          .mountingPointsSpecs[mountingPointSpecId];

                      const index =
                        editableMountingPoint.mountableComponents.indexOf(
                          mountableComponentId,
                          0
                        );
                      if (index > -1) {
                        editableMountingPoint.mountableComponents.splice(
                          index,
                          1
                        );
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
              value={addedComponent}
              onChange={(value: string) => {
                const editableMountingPoint =
                  ProductStore.componentSpecs[componentSpecId]
                    .mountingPointsSpecs[mountingPointSpecId];

                editableMountingPoint.mountableComponents.push(value);
                setAddedComponent("");
              }}
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                  <PlusIcon className="size-4" />
                </div>
                <Combobox.Input
                  className="field block w-full bg-transparent ps-10"
                  placeholder={"Add mountable component..."}
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
                <Combobox.Options className="field absolute mt-1 max-h-60 w-72 overflow-auto">
                  {filteredAddComponent.length === 0 && addTerm !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-center text-sm text-gray-900 dark:text-gray-400">
                      Nothing found.
                    </div>
                  ) : (
                    filteredAddComponent.map((mountableComponentId) => (
                      <Combobox.Option
                        key={mountableComponentId}
                        className={({ active }) =>
                          `relative cursor-default select-none p-2 ${
                            active ? "font-bold" : ""
                          }`
                        }
                        value={mountableComponentId}
                      >
                        <span className={"block truncate"}>
                          {mountableComponentId}
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
