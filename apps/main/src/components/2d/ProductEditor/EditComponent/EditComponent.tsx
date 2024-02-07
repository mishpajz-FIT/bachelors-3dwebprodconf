import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { useSnapshot } from "valtio";

import { EditComponentChange } from "./EditComponentChange.tsx";
import { EditComponentColors } from "./EditComponentColors.tsx";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../stores/UserCreationStore.ts";

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
      <ContainerHeader
        title={"Edit component"}
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
          <button className="other-button mt-3">
            <InformationCircleIcon className="size-4" />
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
