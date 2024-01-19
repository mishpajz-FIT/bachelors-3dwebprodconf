import { useSnapshot } from "valtio";

import { ProductConfirmationTile } from "./ProductConfirmationTile.tsx";
import { UserProductStore } from "../../../../stores/UserProductStore.ts";
import { ContainerHeader } from "../../universal/ContainerHeader.tsx";

export const ProductConfirmation = () => {
  const userProductSnap = useSnapshot(UserProductStore);

  return (
    <div className="flex select-none flex-col items-center justify-center bg-white p-4 dark:bg-gray-900">
      <div className="w-full md:w-4/5 lg:w-2/3">
        <ContainerHeader title={"Confirm configuration"} onClose={undefined} />
      </div>
      <ul className="d:w-4/5 flex w-full flex-col justify-center rounded-xl bg-slate-50 lg:w-2/3 dark:bg-slate-800">
        {Object.keys(userProductSnap.components).map((componentId, index) => (
          <li
            key={componentId}
            className={`${index !== Object.keys(userProductSnap.components).length - 1 ? "border-b dark:border-b-gray-700" : ""}`}
          >
            <ProductConfirmationTile componentId={componentId} />
          </li>
        ))}
      </ul>
    </div>
  );
};
