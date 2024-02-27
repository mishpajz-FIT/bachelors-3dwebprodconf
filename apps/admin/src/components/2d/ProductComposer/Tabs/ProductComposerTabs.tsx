import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { Tab } from "@headlessui/react";
import { useState } from "react";

import { BasesList } from "./BasesList.tsx";
import { ComponentsList } from "./ComponentsList.tsx";
import {
  exportProduct,
  missingColorsInMaterials,
  missingComponentsInMountingPoints,
  missingModelsInMaterials,
} from "../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../stores/ProductStore.ts";

export const ProductComposerTabs = () => {
  const [exportIssues, setExportIssues] = useState<string[]>([]);

  const tabClassName = (selected: boolean) => {
    const basicStyle =
      "w-full rounded-md px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 dark:text-white dark:ring-zinc-600 dark:focus:ring-zinc-500";
    const selectedStyle =
      "bg-white shadow-sm dark:bg-zinc-900 dark:text-white dark:ring-zinc-600";

    return `${basicStyle} ${selected ? selectedStyle : ""}`;
  };

  const verifyExport = () => {
    setExportIssues([]);
    const issues = [];

    const missingComponents = missingComponentsInMountingPoints();
    const missingColors = missingColorsInMaterials();
    const missingModels = missingModelsInMaterials();

    if (Object.keys(ProductStore.baseSpecs).length === 0) {
      issues.push(`No base has been specified.`);
    }

    Object.entries(missingComponents).forEach(
      ([componentId, mountingPoints]) => {
        if (mountingPoints.length > 0) {
          issues.push(
            `Component specification "${componentId}" has mounting points without mountable components: ${mountingPoints.join(", ")}.`
          );
        }
      }
    );

    Object.entries(missingColors).forEach(([componentId, materials]) => {
      if (materials.length > 0) {
        issues.push(
          `Component specification "${componentId}" has materials without colors: ${materials.join(", ")}.`
        );
      }
    });

    Object.entries(missingModels).forEach(([componentId, materials]) => {
      if (materials.length > 0) {
        issues.push(
          `Component specification "${componentId}" has materials without models: ${materials.join(", ")}.`
        );
      }
    });

    if (issues.length === 0) {
      exportProduct();
    } else {
      setExportIssues(issues);
    }
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
              <ComponentsList />
            </Tab.Panel>
            <Tab.Panel>
              <BasesList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <div className="mt-auto flex justify-end p-2">
        <button className="primary-button" onClick={verifyExport}>
          Export
        </button>
      </div>

      <Popup
        isOpen={exportIssues.length !== 0}
        onClose={() => setExportIssues([])}
      >
        <div className="flex min-w-96 flex-col">
          <ContainerHeader
            title="Export issues"
            onClose={() => setExportIssues([])}
            subheader={true}
          />
          <ul className="w-full">
            {exportIssues.map((issue, index) => (
              <li
                key={index}
                className="m-2 rounded-lg bg-[var(--error-light)] p-2 text-sm text-white dark:bg-[var(--error-dark)]"
              >
                {issue}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-row items-center justify-end p-2">
            <button
              className="secondary-button"
              onClick={() => {
                exportProduct();
                setExportIssues([]);
              }}
            >
              Export anyway
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};
