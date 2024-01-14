import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useSnapshot } from "valtio";

import { ContainerHeader } from "./containers/ContainerHeader.tsx";
import { EditComponentChange } from "./EditComponentChange.tsx";
import { EditComponentColors } from "./EditComponentColors.tsx";
import { EditorValuesStore } from "../../stores/EditorValuesStore.ts";
import { ProductSpecificationStore } from "../../stores/ProductSpecificationStore.ts";
import { UserProductStore } from "../../stores/UserProductStore.ts";

interface EditComponentProps {
  onClose: () => void;
}

export const EditComponent = ({ onClose }: EditComponentProps) => {
  const userProductSnap = useSnapshot(UserProductStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentId = editorValuesSnap.selectedComponentId;
  if (!componentId) return null;

  const component = userProductSnap.components[componentId];
  if (!component) return null;

  const componentSpecId = component.componentSpec;
  const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];
  if (!componentSpec) return null;

  return (
    <div className="flex w-full flex-col">
      <ContainerHeader title={"Edit component"} onClose={onClose} />
      <div className="flex flex-col overflow-y-auto p-2">
        <div className="pt-6">
          <h2 className="truncate text-lg font-bold">{componentSpec.name}</h2>
          <p className="line-clamp-3 text-pretty text-sm leading-tight text-gray-600 dark:text-gray-400">
            {componentSpec.description}
          </p>
          <button className="other-button mt-3">
            <InformationCircleIcon className="h-4 w-4" />
          </button>

          {Object.keys(componentSpec.materialSpecs).length !== 0 && (
            <div className="pt-8">
              <h4 className="text-base font-medium">Materials</h4>
              <EditComponentColors componentId={componentId} />
            </div>
          )}
        </div>
      </div>
      {editorValuesSnap.selectedComponentId != userProductSnap.base && (
        <div className="mt-auto flex items-center justify-center gap-2 p-2">
          <EditComponentChange componentId={componentId} onClose={onClose} />
        </div>
      )}
    </div>
  );
};
