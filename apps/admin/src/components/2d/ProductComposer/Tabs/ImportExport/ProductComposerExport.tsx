import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { useState } from "react";

import {
  exportProduct,
  missingColorsInMaterials,
  missingComponentsInMountingPoints,
  missingModelsInMaterials,
} from "../../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";

export const ProductComposerExport = () => {
  const [exportIssues, setExportIssues] = useState<string[]>([]);

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
    <>
      <button className="primary-button" onClick={verifyExport}>
        Export
      </button>
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
    </>
  );
};
