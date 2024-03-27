import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { useSnapshot } from "valtio";

import { EditComponentColors } from "./subcomponents/EditComponentColors.tsx";
import { EditComponentControls } from "./subcomponents/EditComponentControls.tsx";
import { ConfiguratorValuesStore } from "../../../../stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../stores/UserCreationStore.ts";
import { useTranslation } from "react-i18next";

interface EditComponentProps {
  onClose: () => void;
}

export const EditComponent = ({ onClose }: EditComponentProps) => {
  const { t } = useTranslation();

  const userCreationSnap = useSnapshot(UserCreationStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const configuratorValuesSnap = useSnapshot(ConfiguratorValuesStore);

  const componentId = configuratorValuesSnap.selectedComponentId;
  if (!componentId) return null;

  const component = userCreationSnap.value.components[componentId];
  if (!component) return null;

  const componentSpecId = component.componentSpec;
  const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];
  if (!componentSpec) return null;

  return (
    <div className="flex w-full select-none flex-col">
      <ContainerHeader
        title={t("editComponent")}
        onClose={onClose}
        subheader={true}
      />
      <div className="flex flex-col overflow-y-auto p-2">
        <div className="pt-6">
          <h2 className="select-text truncate text-lg font-semibold">
            {componentSpec.name}
          </h2>
          <p className="line-clamp-3 select-text text-pretty text-sm leading-tight text-slate-600 dark:text-slate-400">
            {componentSpec.description}
          </p>
          {/*<button className="other-button mt-3">
            <InformationCircleIcon className="size-4" />
          </button>*/}

          {Object.keys(componentSpec.materialSpecs).length !== 0 && (
            <div className="pt-8">
              <h4 className="section-heading">{t("materials")}</h4>
              <EditComponentColors componentId={componentId} />
            </div>
          )}
        </div>
      </div>
      {configuratorValuesSnap.selectedComponentId !=
        userCreationSnap.value.base && (
        <div className="mt-auto flex items-center justify-center gap-2 p-2">
          <EditComponentControls componentId={componentId} onClose={onClose} />
        </div>
      )}
    </div>
  );
};
