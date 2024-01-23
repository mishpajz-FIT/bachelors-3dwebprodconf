import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useSnapshot } from "valtio";

import { EditComponentChange } from "./EditComponentChange.tsx";
import { EditComponentColors } from "./EditComponentColors.tsx";
import { EditorValuesStore } from "../../../../../stores/EditorValuesStore.ts";
import { ProductSpecificationStore } from "../../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../../stores/UserCreationStore.ts";
import { ContainerHeader } from "../../../universal/ContainerHeader.tsx";

interface EditComponentProps {
  onClose: () => void;
}

export const EditComponent = ({ onClose }: EditComponentProps) => {
  const userCreationSnap = useSnapshot(UserCreationStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentId = editorValuesSnap.selectedComponentId;
  if (!componentId) return null;

  const component = userCreationSnap.components[componentId];
  if (!component) return null;

  const componentSpecId = component.componentSpec;
  const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];
  if (!componentSpec) return null;

  return (
    <div className="flex w-full select-none flex-col">
      <ContainerHeader title={"Edit component"} onClose={onClose} />
      <div className="flex flex-col overflow-y-auto p-2">
        <div className="select-text pt-6">
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
      {editorValuesSnap.selectedComponentId != userCreationSnap.base && (
        <div className="mt-auto flex items-center justify-center gap-2 p-2">
          <EditComponentChange componentId={componentId} onClose={onClose} />
        </div>
      )}
    </div>
  );
};
