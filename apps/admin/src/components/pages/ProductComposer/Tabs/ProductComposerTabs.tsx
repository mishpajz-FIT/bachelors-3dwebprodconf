import { HoldButton } from "@3dwebprodconf/shared/src/components/HoldButton.tsx";
import { Tab } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";

import { ProductComposerTabsBasesList } from "./subcomponents/ProductComposerTabsBasesList.tsx";
import { ProductComposerTabsComponentsList } from "./subcomponents/ProductComposerTabsComponentsList.tsx";
import { ProductComposerTabsExportButton } from "./subcomponents/ProductComposerTabsExportButton.tsx";
import { ProductComposerTabsImportButton } from "./subcomponents/ProductComposerTabsImportButton.tsx";
import { ProductActions } from "../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";

export const ProductComposerTabs = () => {
  const tabClassName = (selected: boolean) => {
    const basicStyle =
      "w-full rounded-md px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 dark:text-white dark:ring-zinc-600 dark:focus:ring-zinc-500";
    const selectedStyle =
      "bg-white shadow-sm dark:bg-zinc-900 dark:text-white dark:ring-zinc-600";

    return `${basicStyle} ${selected ? selectedStyle : ""}`;
  };

  return (
    <div className="simple-panel z-10 flex h-full w-1/2 flex-col rounded-none p-2 lg:w-1/4 xl:w-1/5">
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
              <ProductComposerTabsComponentsList />
            </Tab.Panel>
            <Tab.Panel>
              <ProductComposerTabsBasesList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <div className="mt-auto flex flex-row justify-between gap-1 p-2">
        <HoldButton
          className="other-button destructive-button-on-hold flex items-center justify-center"
          onSubmit={() => {
            ProductActions.clearProductSpecification(ProductStore);
          }}
          duration={500}
          popoverPosition={"top-start"}
          popoverOffset={6}
        >
          <TrashIcon className="size-4" />
          <span className="ml-2">Clear</span>
        </HoldButton>
        <div className="flex flex-row gap-1">
          <ProductComposerTabsImportButton />
          <ProductComposerTabsExportButton />
        </div>
      </div>
    </div>
  );
};
