import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { UserCreationActions } from "../../../../stores/actions/UserCreationActions.ts";
import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../stores/UserCreationStore.ts";
import { refreshBounds } from "../../../../utilities/BoundsManipulation.ts";
import { AddComponentTile } from "../AddComponent/subcomponents/AddComponentTile.tsx";

interface SelectBaseProps {
  onClose: () => void;
}

export const SelectBase = ({ onClose }: SelectBaseProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const userCreationSnap = useSnapshot(UserCreationStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const handleSelectBase = useCallback(
    (newComponentSpecId: string) => {
      const createAndSetBase = () => {
        const newComponentId = UserCreationActions.createComponent(
          newComponentSpecId,
          UserCreationStore.value,
          ProductSpecificationStore
        );

        UserCreationActions.setBase(newComponentId, UserCreationStore.value);
      };

      refreshBounds(createAndSetBase);
      onClose();
    },
    [onClose]
  );

  const sortBases = (
    lhsBase: [string, string],
    rhsBase: [string, string]
  ): number => {
    // eslint-disable-next-line valtio/state-snapshot-rule
    const lhsComponentSpec = productSpecsSnap.componentSpecs[lhsBase[1]];
    // eslint-disable-next-line valtio/state-snapshot-rule
    const rhsComponentSpec = productSpecsSnap.componentSpecs[rhsBase[1]];

    if (
      lhsComponentSpec.sortIndex !== undefined &&
      rhsComponentSpec.sortIndex !== undefined
    ) {
      return lhsComponentSpec.sortIndex - rhsComponentSpec.sortIndex;
    } else if (lhsComponentSpec.sortIndex === undefined) {
      return 1;
    } else {
      return -1;
    }
  };

  return (
    <div className="content-background flex size-full select-none flex-col items-center justify-start px-4 pt-4">
      <div className="content-width">
        <ContainerHeader
          title={t("selectBase")}
          onClose={userCreationSnap.value.isBaseSet ? onClose : undefined}
        />
      </div>
      <div className="content-width mb-10 flex flex-wrap justify-start">
        {Object.entries(productSpecsSnap.baseSpecs)
          .sort(sortBases)
          .map(([baseSpecId, componentSpecId]) => (
            <div
              className="h-[165px] w-full p-2 md:w-1/2 lg:w-1/3"
              key={baseSpecId}
            >
              <AddComponentTile
                componentSpecId={componentSpecId}
                onAdd={() => handleSelectBase(componentSpecId)}
              />
            </div>
          ))}
      </div>
      <div className="fixed bottom-2 left-2 flex w-full flex-row justify-start">
        <button className="other-button" onClick={() => navigate("/")}>
          {t("changeProduct")}
        </button>
      </div>
    </div>
  );
};
