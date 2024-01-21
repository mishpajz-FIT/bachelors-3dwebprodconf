import { useCallback } from "react";
import { useSnapshot } from "valtio";

import {
  createNewComponent,
  mountBase,
} from "../../../../stores/actions/UserProductActions.ts";
import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { ContainerHeader } from "../../universal/ContainerHeader.tsx";
import { AddComponentTile } from "../AddComponent/AddComponentTile.tsx";

interface SelectBaseProps {
  onClose: () => void;
}

export const SelectBase = ({ onClose }: SelectBaseProps) => {
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
    <div className="flex select-none flex-col items-center justify-center bg-white p-4 dark:bg-gray-900">
      <div className="content-width">
        <ContainerHeader title={"Select base"} onClose={onClose} />
      </div>
      <div className="content-width flex flex-wrap justify-center gap-4">
        {Object.entries(productSpecsSnap.baseSpecs).map(
          ([baseKey, baseSpecs]) => (
            <AddComponentTile
              key={baseKey}
              componentSpecId={baseSpecs.component}
              add={() => selectBase(baseSpecs.component)}
            />
          )
        )}
      </div>
    </div>
  );
};
