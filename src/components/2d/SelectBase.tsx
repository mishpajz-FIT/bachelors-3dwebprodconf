import {useSnapshot} from "valtio";

import {AddComponentTile} from "./AddComponentTile.tsx";
import {createNewComponent, mountBase} from "../../stores/actions/UserProductActions.ts";
import {ProductSpecificationStore} from "../../stores/ProductSpecificationStore.ts";

export const SelectBase = () => {
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const selectBase = (newComponentSpecId: string) => {
    const newComponentId = createNewComponent(newComponentSpecId);

    mountBase(newComponentId);
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(productSpecsSnap.baseSpecs).map(([baseKey, baseSpecs]) => (
          <AddComponentTile
            key={baseKey}
            componentSpecId={baseSpecs.component}
            add={() => selectBase(baseSpecs.component)} />
        ))}
      </div>
    </div>
  );
};