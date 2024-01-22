import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useContext, useState } from "react";
import { useSnapshot } from "valtio";

import { ConfigContext } from "../../../../../configurations/contexts/ConfigContext.ts";
import { manipulateCanvas } from "../../../../../providers/CanvasManipulation.ts";
import {
  createNewComponent,
  mountComponent,
  removeComponent,
} from "../../../../../stores/actions/UserProductActions.ts";
import { EditorValuesStore } from "../../../../../stores/EditorValuesStore.ts";
import { ProductSpecificationStore } from "../../../../../stores/ProductSpecificationStore.ts";
import { UserProductStore } from "../../../../../stores/UserProductStore.ts";
import { Modal } from "../../../universal/containers/Modal.tsx";
import { HoldButton } from "../../../universal/HoldButton.tsx";
import { AddComponent } from "../AddComponent/AddComponent.tsx";

interface EditComponentChangeProps {
  componentId: string;
  onClose?: () => void;
}
export const EditComponentChange = ({
  componentId,
  onClose,
}: EditComponentChangeProps) => {
  const appConfig = useContext(ConfigContext);

  const userProductSnap = useSnapshot(UserProductStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const [isChangeModalOpen, setChangeModalOpen] = useState(false);

  const parentInfo = userProductSnap.childToParentMap.get(componentId);
  if (!parentInfo) {
    throw Error(
      `Component hierarchy is damaged, components is without parent component!`
    );
  }
  const [parentComponentId, parentMountingPointId] = parentInfo;

  const parentComponent = userProductSnap.components[parentComponentId];
  if (!parentComponent) {
    throw Error(`Could not find component ${parentComponentId}!`);
  }

  const parentComponentSpec =
    productSpecsSnap.componentSpecs[parentComponent.componentSpec];
  if (!parentComponentSpec) {
    throw Error(
      `Could not find component spec ${parentComponent.componentSpec}!`
    );
  }

  const remove = useCallback(() => {
    const action = () => {
      removeComponent(componentId);
    };

    manipulateCanvas(action, appConfig);

    if (onClose) {
      onClose();
    }
  }, [appConfig, onClose, componentId]);

  const change = useCallback(
    (newComponentSpecId: string) => {
      const action = () => {
        const newComponentId = createNewComponent(newComponentSpecId);
        mountComponent(
          parentComponentId,
          parentMountingPointId,
          newComponentId
        );

        EditorValuesStore.selectedComponentId = newComponentId;
      };

      manipulateCanvas(action, appConfig);
    },
    [appConfig, parentComponentId, parentMountingPointId]
  );

  return (
    <>
      <button
        className="other-button flex w-full items-center justify-center"
        onClick={() => setChangeModalOpen(true)}
      >
        <PencilIcon className="h-4 w-4" />
        <span className="ml-2">Change</span>
      </button>
      <HoldButton
        className="other-button destructive-button-on-hold flex w-full items-center justify-center"
        onSubmit={remove}
        duration={650}
        popoverPosition={"top-end"}
        popoverOffset={6}
      >
        <TrashIcon className="h-4 w-4" />
        <span className="ml-2">Remove</span>
      </HoldButton>
      <Modal
        isOpen={isChangeModalOpen}
        onClose={() => setChangeModalOpen(false)}
      >
        <AddComponent
          mountableComponentsSpecs={
            parentComponentSpec.mountingPointsSpecs[parentMountingPointId]
              .mountableComponents
          }
          onClose={() => setChangeModalOpen(false)}
          add={change}
        />
      </Modal>
    </>
  );
};
