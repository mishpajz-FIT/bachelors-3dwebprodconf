import { useCallback } from "react";
import { useSnapshot } from "valtio";

import { AddComponentTile } from "./AddComponentTile.tsx";
import { ContainerHeader } from "./containers/ContainerHeader.tsx";
import {
  createNewComponent,
  mountBase,
} from "../../stores/actions/UserProductActions.ts";
import { ProductSpecificationStore } from "../../stores/ProductSpecificationStore.ts";

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
    <div className="flex flex-col items-center justify-center bg-white p-4 dark:bg-gray-900">
      <div className="w-full md:w-4/5 lg:w-2/3">
        <ContainerHeader title={"Select base"} onClose={onClose} />
      </div>
      <div className="flex w-full flex-wrap justify-center gap-4 md:w-4/5 lg:w-2/3">
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
