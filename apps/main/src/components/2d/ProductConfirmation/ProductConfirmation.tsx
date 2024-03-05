import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { ProductConfirmationTile } from "./subcomponents/ProductConfirmationTile.tsx";
import { globalConfig } from "../../../configurations/Config.ts";
import { ConfiguratorValuesStore } from "../../../stores/ConfiguratorValuesStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";

export const ProductConfirmation = () => {
  const navigate = useNavigate();

  const userCreationSnap = useSnapshot(UserCreationStore);

  const onClose = useCallback(() => {
    navigate("/" + ConfiguratorValuesStore.currentProductId + "/editor");
  }, [navigate]);

  return (
    <div className="content-background flex size-full select-none flex-col items-center justify-start overflow-y-scroll p-4">
      <div className="content-width no-print">
        <ContainerHeader title={"Confirm configuration"} onClose={undefined} />
      </div>

      <div className="flex w-full grow flex-row justify-center">
        <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2">
          <ol className="simple-panel mb-20 mt-2 flex w-full flex-col justify-start rounded-xl shadow-none">
            {Object.keys(userCreationSnap.components).map(
              (componentId, index) => (
                <li
                  key={index}
                  className={`${index !== Object.keys(userCreationSnap.components).length - 1 ? "border-b border-b-gray-300 dark:border-b-gray-700" : ""}`}
                >
                  <ProductConfirmationTile componentId={componentId} />
                </li>
              )
            )}
          </ol>
        </div>

        <div className="no-print sticky top-12 hidden h-min pl-6 pt-6 lg:flex lg:w-1/4 xl:w-3/12 2xl:w-1/5">
          <div className="simple-panel flex w-full flex-col gap-2 p-4">
            {globalConfig.config.capabilities.savePdfButton && (
              <div className="flex flex-row items-center justify-end gap-1">
                <button className="other-button" onClick={() => window.print()}>
                  Save as PDF
                </button>
              </div>
            )}
            <div className="flex flex-row items-center justify-end gap-1">
              <button className="other-button" onClick={onClose}>
                Back
              </button>
              <button className="primary-button">Confirm</button>
            </div>
          </div>
        </div>
      </div>

      <div className="simple-panel no-print absolute inset-x-0 bottom-0 w-full rounded-b-none shadow-2xl lg:hidden">
        <div className="flex flex-row items-center justify-between px-2 py-4">
          <button className="other-button" onClick={onClose}>
            Back
          </button>
          <div className="flex flex-row items-center justify-end gap-1">
            {globalConfig.config.capabilities.savePdfButton && (
              <button className="other-button" onClick={() => window.print()}>
                Save as PDF
              </button>
            )}
            <button className="primary-button">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};
