import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import {
  createNewComponent,
  mountBase,
} from "../../../../../stores/actions/UserProductActions.ts";
import { ProductSpecificationStore } from "../../../../../stores/ProductSpecificationStore.ts";
import { UserProductStore } from "../../../../../stores/UserProductStore.ts";
import { ContainerHeader } from "../../../universal/ContainerHeader.tsx";
import { AddComponentTile } from "../AddComponent/AddComponentTile.tsx";

interface SelectBaseProps {
  onClose: () => void;
}

export const SelectBase = ({ onClose }: SelectBaseProps) => {
  const navigate = useNavigate();

  const userProductSnap = useSnapshot(UserProductStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const selectBase = useCallback(
    (newComponentSpecId: string) => {
      const newComponentId = createNewComponent(newComponentSpecId);

      mountBase(newComponentId);
      onClose();
    },
    [onClose]
  );

  return (
    <div className="flex h-full w-full select-none flex-col items-center justify-start bg-white pt-4 dark:bg-gray-900">
      <div className="content-width px-4">
        <ContainerHeader
          title={"Select base"}
          onClose={userProductSnap.isBaseSet ? onClose : undefined}
        />
      </div>
      <div className="content-width flex flex-wrap justify-start px-4">
        {Object.values(productSpecsSnap.baseSpecs).map((baseSpecs, index) => (
          <div className="h-[165px] w-full p-2 md:w-1/2 lg:w-1/3" key={index}>
            <AddComponentTile
              componentSpecId={baseSpecs.component}
              add={() => selectBase(baseSpecs.component)}
            />
          </div>
        ))}
      </div>
      <div className="mt-auto w-full">
        <div className="flex flex-row justify-start px-2 pb-2">
          <button className="other-button" onClick={() => navigate("/")}>
            Change product
          </button>
        </div>
      </div>
    </div>
  );
};
