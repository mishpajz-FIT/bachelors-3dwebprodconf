import { Tab } from "@headlessui/react";

import { BasesList } from "./BasesList.tsx";
import { ComponentsList } from "./ComponentsList.tsx";

export const ProductComposerTabs = () => {
  const tabClassName = (selected: boolean) => {
    const basicStyle =
      "w-full rounded-md px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 dark:text-white dark:ring-zinc-600 dark:focus:ring-zinc-500";
    const selectedStyle =
      "bg-white shadow-sm dark:bg-zinc-900 dark:text-white dark:ring-zinc-600";

    return `${basicStyle} ${selected ? selectedStyle : ""}`;
  };

  return (
    <div className="simple-panel z-10 flex h-full w-1/2 flex-col rounded-none p-2 lg:w-1/4">
      <div className="w-full">
        <Tab.Group>
          <Tab.List className="mt-2 flex space-x-1 rounded-md bg-gray-100 p-1 dark:bg-zinc-800">
            {["Components", "Bases"].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) => tabClassName(selected)}
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <ComponentsList />
            </Tab.Panel>
            <Tab.Panel>
              <BasesList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <div className="mt-auto flex justify-end p-2">
        <button
          className="primary-button"
          onClick={() => {
            console.log("Exporting...");
          }}
        >
          Export
        </button>
      </div>
    </div>
  );
};
