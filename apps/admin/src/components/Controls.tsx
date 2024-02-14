import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { useState } from "react";
import { useSnapshot } from "valtio";

import { AddComponentSpecification } from "./AddComponentSpecification.tsx";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

export const Controls = () => {
  const componentsSnap = useSnapshot(ComponentsStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const [isOpenAdd, setOpenAdd] = useState(false);

  return (
    <div className="simple-panel z-10 flex h-full w-1/2 flex-col rounded-none p-2 lg:w-1/4">
      <ContainerHeader title={"Catalog"} />
      <ul className="m-4">
        {Object.keys(componentsSnap.components).map((componentId) => (
          <li
            key={componentId}
            className={`tile m-1 rounded-lg border
            ${editorValuesSnap.selectedComponentSpec === componentId ? "border-[var(--primary-light)] dark:border-[var(--primary-dark)]" : "border-transparent"}
            `}
          >
            <button
              onClick={() => {
                EditorValuesStore.selectedComponentSpec = componentId;
              }}
              className="flex w-full flex-row items-center justify-start gap-2 p-2"
            >
              <div
                className={`size-2 rounded-full bg-gray-100 ring-1 ring-gray-200 ${editorValuesSnap.selectedComponentSpec === componentId ? "bg-[var(--primary-light)] dark:bg-[var(--primary-dark)]" : ""}`}
              />
              <span className="text-wrap font-mono text-sm font-semibold slashed-zero tabular-nums tracking-tight text-black dark:text-gray-200">
                {componentId}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex justify-end p-2">
        <button
          className="primary-button"
          onClick={() => {
            setOpenAdd(true);
          }}
        >
          Add new component
        </button>
        <Popup isOpen={isOpenAdd} onClose={() => setOpenAdd(false)}>
          <AddComponentSpecification onClose={() => setOpenAdd(false)} />
        </Popup>
      </div>
    </div>
  );
};
