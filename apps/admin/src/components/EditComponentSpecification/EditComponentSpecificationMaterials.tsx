import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { Side } from "@3dwebprodconf/shared/src/components/containers/Side.tsx";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSnapshot } from "valtio";

import { useSelectedComponentSpec } from "../../hooks/useSelectedComponentSpec.ts";
import { EditorValuesStore } from "../../stores/EditorValuesStore.ts";
import { AddMaterial } from "../Add/AddMaterial.tsx";
import { EditMaterialSpecification } from "../EditMaterialSpecification/EditMaterialSpecification.tsx";

export const EditComponentSpecificationMaterials = () => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);
  const { componentSpec } = useSelectedComponentSpec();

  const [searchTerm, setSearchTerm] = useState("");

  const [isOpenAdd, setOpenAdd] = useState(false);

  const filteredMaterials = Object.keys(componentSpec.materialSpecs).filter(
    (materialSpecId) =>
      materialSpecId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3 className="section-heading">Materials</h3>
      <div className="mx-4 rounded-md bg-slate-50 p-1 outline outline-1 outline-slate-100 dark:bg-zinc-800 dark:outline-zinc-800">
        <form
          className="m-1"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="material-search" className="sr-only">
            Search materials
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <MagnifyingGlassIcon className="size-4" />
            </div>
            <input
              type="search"
              id="material-search"
              className="field block w-full bg-transparent ps-10"
              placeholder="Search materials..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </form>
        <ul className="flex max-h-48 min-h-24 shrink-0 flex-col items-center justify-start overflow-x-clip overflow-y-scroll overscroll-y-contain p-2">
          {filteredMaterials.length === 0 ? (
            <li className="p-4 text-center text-sm text-gray-900 dark:text-gray-400">
              No materials
            </li>
          ) : (
            filteredMaterials.map((materialSpecId) => (
              <li key={materialSpecId} className="tile m-1 w-full rounded-lg">
                <button
                  onClick={() => {
                    EditorValuesStore.selectedMaterial = materialSpecId;
                  }}
                  className="w-full p-2"
                >
                  <span className="w-full text-wrap font-mono text-sm font-semibold slashed-zero tabular-nums tracking-tight text-black dark:text-gray-200">
                    {materialSpecId}
                  </span>
                </button>
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
            <AddMaterial onClose={() => setOpenAdd(false)} />
          </Popup>
        </div>
      </div>
      <Side
        isOpen={editorValuesSnap.selectedMaterial !== undefined}
        larger={true}
      >
        <EditMaterialSpecification
          onClose={() => {
            EditorValuesStore.selectedMaterial = undefined;
          }}
        />
      </Side>
    </div>
  );
};
