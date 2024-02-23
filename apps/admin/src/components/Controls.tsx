import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { ComponentsCatalog } from "./ComponentsCatalog.tsx";
import { Tab } from "@headlessui/react";

export const Controls = () => {
  return (
    <div className="simple-panel z-10 flex h-full w-1/2 flex-col rounded-none p-2 lg:w-1/4">
      <ContainerHeader title={"Catalog"} />

      <div className="w-full">
        <Tab.Group>
          <Tab.List className="mt-2 flex space-x-1 rounded-md bg-gray-100 p-1 dark:bg-zinc-800">
            {["Components", "Bases"].map((tab) => (
              <Tab
                className={({ selected }) => {
                  return `w-full rounded-md px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 dark:text-white dark:ring-zinc-600 dark:focus:ring-zinc-500
                  ${
                    selected
                      ? "bg-white shadow-sm dark:bg-zinc-900 dark:text-white dark:ring-zinc-600"
                      : ""
                  }`;
                }}
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <ComponentsCatalog />
            </Tab.Panel>
            <Tab.Panel>Base xy</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <div className="mt-auto flex justify-end p-2">
        <button className="primary-button" onClick={() => {}}>
          Export
        </button>
      </div>
    </div>
  );
};
