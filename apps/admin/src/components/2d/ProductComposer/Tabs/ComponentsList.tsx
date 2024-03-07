import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSnapshot } from "valtio";

import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";
import { AddComponentSpecification } from "../../Add/subcomponents/AddComponentSpecification.tsx";

export const ComponentsList = () => {
  const productSnap = useSnapshot(ProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const [isOpenAdd, setOpenAdd] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredComponents = Object.keys(productSnap.componentSpecs).filter(
    (componentSpecId) =>
      componentSpecId.toLowerCase().includes(searchTerm.toLowerCase())
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
          <label htmlFor="component-search" className="sr-only">
            Search component specifications
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <MagnifyingGlassIcon className="size-4" />
            </div>
            <input
              type="search"
              id="component-search"
              className="field block w-full bg-transparent ps-10"
              placeholder="Search component specifications..."
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
        {filteredComponents.length === 0 ? (
          <li className="pointer-events-none select-none p-4 text-center text-sm text-gray-900 dark:text-gray-400">
            No components
          </li>
        ) : (
          filteredComponents.map((componentId) => (
            <li
              key={componentId}
              className={`tile m-2 rounded-lg border-2 
            ${editorValuesSnap.selectedComponentSpec === componentId ? "underlined-selection border-[var(--primary-light)] underline dark:border-[var(--primary-dark)]" : "border-transparent"}
            `}
            >
              <button
                onClick={() => {
                  EditorValuesStore.selectedComponentSpec = componentId;
                  EditorValuesStore.selectedMountingPoint = undefined;
                  EditorValuesStore.selectedMaterial = undefined;
                }}
                className="flex w-full flex-row items-center justify-start gap-2 p-2"
              >
                <span className="text-wrap font-mono text-sm font-semibold slashed-zero tabular-nums tracking-tight text-black dark:text-gray-200">
                  {componentId}
                </span>
              </button>
            </li>
          ))
        )}
      </ul>

      <Popup isOpen={isOpenAdd} onClose={() => setOpenAdd(false)}>
        <AddComponentSpecification onClose={() => setOpenAdd(false)} />
      </Popup>
    </div>
  );
};
