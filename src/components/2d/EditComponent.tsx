import {TrashIcon} from "@heroicons/react/24/outline";
import {useSnapshot} from "valtio";

import {ContainerHeader} from "./containers/ContainerHeader.tsx";
import {removeComponent} from "../../stores/actions/UserProductActions.ts";
import {EditorValuesStore} from "../../stores/EditorValuesStore.ts";
import {UserProductStore} from "../../stores/UserProductStore.ts";

interface EditComponentProps {
  onClose: () => void;
}

export const EditComponent = ({ onClose }: EditComponentProps) => {
  const userProductSnap = useSnapshot(UserProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const remove = () => {
    const componentId = EditorValuesStore.selectedComponentId;

    if (componentId) {
      removeComponent(componentId);
    }

    onClose();
  };

  return (
    <>
      <ContainerHeader title={"Edit component"} onClose={onClose} />
      <div className="overflow-y-auto">
        {(editorValuesSnap.selectedComponentId != userProductSnap.base) &&
        <button className="destructive-button flex items-center" onClick={remove}>
          <TrashIcon className="h-4 w-4" />
          <span className="ml-2">Remove</span>
        </button>
        }
      </div>
    </>
  );
};
