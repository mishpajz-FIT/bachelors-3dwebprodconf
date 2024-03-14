import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { Popup } from "@3dwebprodconf/shared/src/components/containers/Popup.tsx";
import { ProductSpecificationSchema } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { downloadableJson } from "@3dwebprodconf/shared/src/utilites/Exporting.ts";
import { useState } from "react";

import { ProductActions } from "../../../../../stores/actions/ProductActions.ts";
import { ProductStore } from "../../../../../stores/ProductStore.ts";
import { errorToast } from "../../../../../toasts/errorToast.ts";

const validate = (): string[] => {
  const issues: string[] = [];

  function baseValidation() {
    return Object.keys(ProductStore.baseSpecs).length === 0
      ? [`No base has been specified.`]
      : [];
  }

  function missingComponentsInMountingPointsValidation() {
    const missingComponents =
      ProductActions.missingComponentsInMountingPoints(ProductStore);

    return Object.entries(missingComponents).reduce(
      (acc, [componentId, mountingPoints]) => {
        if (mountingPoints.length > 0) {
          acc.push(
            `Component specification "${componentId}" has mounting points without mountable components: ${mountingPoints.join(", ")}.`
          );
        }
        return acc;
      },
      [] as string[]
    );
  }

  function missingColorsInMaterialsValidation() {
    const missingColors = ProductActions.missingColorsInMaterials(ProductStore);

    return Object.entries(missingColors).reduce(
      (acc, [componentId, materials]) => {
        if (materials.length > 0) {
          acc.push(
            `Component specification "${componentId}" has materials without colors: ${materials.join(", ")}.`
          );
        }
        return acc;
      },
      [] as string[]
    );
  }

  function schemaValidation() {
    const result = ProductSpecificationSchema.safeParse(ProductStore);
    if (result.success) {
      return [];
    }

    return result.error.issues.reduce((acc, issue) => {
      const pathString = issue.path.join(".");
      acc.push(`Error while parsing: ${issue.message}, path: ${pathString}`);
      return acc;
    }, [] as string[]);
  }

  const validations = [
    baseValidation,
    missingComponentsInMountingPointsValidation,
    missingColorsInMaterialsValidation,
    schemaValidation,
  ];

  validations.forEach((validationFunc) => {
    const validationIssues = validationFunc();
    issues.push(...validationIssues);
  });

  return issues;
};

export const ProductComposerTabsExportButton = () => {
  const [exportIssues, setExportIssues] = useState<string[]>([]);

  const onExport = () => {
    setExportIssues([]);
    const issues = validate();

    if (issues.length === 0) {
      try {
        downloadableJson(JSON.stringify(ProductStore), "productspecification");
      } catch (error) {
        let message = "Product specification couldn't be exported.";

        if (error instanceof Error) {
          message = error.message;
        }

        errorToast(message);
      }
    } else {
      setExportIssues(issues);
    }
  };

  return (
    <>
      <button className="primary-button" onClick={onExport}>
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
                downloadableJson(
                  JSON.stringify(ProductStore),
                  "productspecification"
                );
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
