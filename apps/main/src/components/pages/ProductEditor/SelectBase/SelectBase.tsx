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
          UserCreationStore,
          ProductSpecificationStore
        );

        UserCreationActions.setBase(newComponentId, UserCreationStore);
      };

      refreshBounds(createAndSetBase);
      onClose();
    },
    [onClose]
  );

  return (
    <div className="content-background flex size-full select-none flex-col items-center justify-start px-4 pt-4">
      <div className="content-width">
        <ContainerHeader
          title={t("selectBase")}
          onClose={userCreationSnap.value.isBaseSet ? onClose : undefined}
        />
      </div>
      <div className="content-width mb-10 flex flex-wrap justify-start">
        {Object.values(productSpecsSnap.baseSpecs).map((baseSpecs, index) => (
          <div className="h-[165px] w-full p-2 md:w-1/2 lg:w-1/3" key={index}>
            <AddComponentTile
              componentSpecId={baseSpecs.component}
              onAdd={() => handleSelectBase(baseSpecs.component)}
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
