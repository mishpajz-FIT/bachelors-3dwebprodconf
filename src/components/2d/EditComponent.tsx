import {InformationCircleIcon} from "@heroicons/react/20/solid";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/outline";
import {useSnapshot} from "valtio";

import {ContainerHeader} from "./containers/ContainerHeader.tsx";
import {EditComponentColors} from "./EditComponentColors.tsx";
import {removeComponent} from "../../stores/actions/UserProductActions.ts";
import {EditorValuesStore} from "../../stores/EditorValuesStore.ts";
import {ProductSpecificationStore} from "../../stores/ProductSpecificationStore.ts";
import {UserProductStore} from "../../stores/UserProductStore.ts";

interface EditComponentProps {
  onClose: () => void;
}

export const EditComponent = ({ onClose }: EditComponentProps) => {
  const userProductSnap = useSnapshot(UserProductStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentId = editorValuesSnap.selectedComponentId;
  if (!componentId) {
    return null;
  }

  const component = userProductSnap.components[componentId];
  if (!component) {
    return null;
  }

  const componentSpecId = component.componentSpec;
  const componentSpec = productSpecsSnap.componentSpecs.get(componentSpecId);
  if (!componentSpec) {
    return null;
  }

  const remove = () => {
    if (componentId) {
      removeComponent(componentId);
    }

    onClose();
  };

  return (
    <div className="flex w-full flex-col">
      <ContainerHeader title={"Edit component"} onClose={onClose} />
      <div className="flex flex-col overflow-y-auto p-2">
        <div className="pt-6">
          <h2 className="truncate text-lg font-bold">{componentSpec.name}</h2>
          <p className="line-clamp-3 text-pretty text-sm leading-tight text-gray-600 dark:text-gray-400">{componentSpec.description}</p>
          <button className="other-button mt-3">
            <InformationCircleIcon className="h-4 w-4" />
          </button>

          {componentSpec.materialSpecs.length !== 0 && (<div className="pt-8">
            <h4 className="text-base font-medium">Materials</h4>
            <EditComponentColors componentId={componentId} componentSpec={componentSpec} />
          </div>)}
        </div>
      </div>
      <div className="mt-auto flex items-center justify-center gap-2 p-2">
        <button className="other-button flex w-full items-center justify-center" onClick={remove}>
          <PencilIcon className="h-4 w-4" />
          <span className="ml-2">Change</span>
        </button>
        {(editorValuesSnap.selectedComponentId != userProductSnap.base) &&
          <button className="destructive-button flex w-full items-center justify-center" onClick={remove}>
            <TrashIcon className="h-4 w-4" />
            <span className="ml-2">Remove</span>
          </button>
        }
      </div>
    </div>
  );
};
