import { useSnapshot } from "valtio";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { AddComponentSpecification } from "./Add/AddComponentSpecification.tsx";

export const ComponentsCatalog = () => {
  const componentsSnap = useSnapshot(ComponentsStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const [isOpenAdd, setOpenAdd] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredComponents = Object.keys(componentsSnap.components).filter(
    (componentSpecId) =>
      componentSpecId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <form
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
      <ul className="mt-2">
        {filteredComponents.map((componentId) => (
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
              }}
              className="flex w-full flex-row items-center justify-start gap-2 p-2"
            >
              <span className="text-wrap font-mono text-sm font-semibold slashed-zero tabular-nums tracking-tight text-black dark:text-gray-200">
                {componentId}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Popup isOpen={isOpenAdd} onClose={() => setOpenAdd(false)}>
        <AddComponentSpecification onClose={() => setOpenAdd(false)} />
      </Popup>
    </div>
  );
};
