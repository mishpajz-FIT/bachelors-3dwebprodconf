import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { ProductConfirmationTile } from "./ProductConfirmationTile.tsx";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { UserProductStore } from "../../../../stores/UserProductStore.ts";
import { ContainerHeader } from "../../universal/ContainerHeader.tsx";

export const ProductConfirmation = () => {
  const navigate = useNavigate();

  const userProductSnap = useSnapshot(UserProductStore);

  const onClose = useCallback(() => {
    navigate("/" + EditorValuesStore.currentProductId + "/editor");
  }, [navigate]);

  return (
    <div className="flex h-full w-full select-none flex-col items-center justify-start overflow-y-scroll bg-white p-4 dark:bg-gray-900">
      <div className="content-width">
        <ContainerHeader title={"Confirm configuration"} onClose={undefined} />
      </div>

      <div className="flex w-full grow flex-row justify-center">
        <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2">
          <ol className="mb-20 mt-2 flex w-full flex-col justify-start rounded-xl bg-slate-50 outline outline-1 outline-gray-300 dark:bg-slate-800 dark:outline-gray-700">
            {Object.keys(userProductSnap.components).map(
              (componentId, index) => (
                <li
                  key={index}
                  className={`${index !== Object.keys(userProductSnap.components).length - 1 ? "border-b border-b-gray-300 dark:border-b-gray-700" : ""}`}
                >
                  <ProductConfirmationTile componentId={componentId} />
                </li>
              )
            )}
          </ol>
        </div>

        <div className="sticky top-12 hidden h-min pl-6 pt-6 lg:flex lg:w-1/4 xl:w-3/12 2xl:w-1/5">
          <div className="simple-panel flex w-full flex-col p-4">
            <div className="flex flex-row items-center justify-start gap-1">
              <button className="other-button" onClick={onClose}>
                Back
              </button>
              <button className="primary-button">Confirm</button>
            </div>
          </div>
        </div>
      </div>

      <div className="simple-panel absolute inset-x-0 bottom-0 w-full rounded-b-none shadow-2xl lg:hidden">
        <div className="flex flex-row items-center justify-between px-2 py-4">
          <button className="other-button" onClick={onClose}>
            Back
          </button>
          <button className="primary-button">Confirm</button>
        </div>
      </div>
    </div>
  );
};
