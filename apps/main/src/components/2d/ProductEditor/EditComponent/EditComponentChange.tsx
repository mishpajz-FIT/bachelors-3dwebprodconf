import { Modal } from "@3dwebprodconf/shared/src/components/containers/Modal.tsx";
import { HoldButton } from "@3dwebprodconf/shared/src/components/HoldButton.tsx";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { useSnapshot } from "valtio";

import {
  createComponent,
  mountComponent,
  removeComponent,
} from "../../../../stores/actions/UserCreationActions.ts";
import { EditorValuesStore } from "../../../../stores/EditorValuesStore.ts";
import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../stores/UserCreationStore.ts";
import { refreshBounds } from "../../../../utilities/BoundsManimpuation.ts";
import { AddComponent } from "../AddComponent/AddComponent.tsx";

interface EditComponentChangeProps {
  componentId: string;
  onClose?: () => void;
}
export const EditComponentChange = ({
  componentId,
  onClose,
}: EditComponentChangeProps) => {
  const userCreationSnap = useSnapshot(UserCreationStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const [isChangeModalOpen, setChangeModalOpen] = useState(false);

  const parentInfo = userCreationSnap.childToParentMap.get(componentId);
  if (!parentInfo) {
    throw Error(
      `Component hierarchy is damaged, components is without parent component!`
    );
  }
  const [parentComponentId, parentMountingPointId] = parentInfo;

  const parentComponent = userCreationSnap.components[parentComponentId];
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
      removeComponent(componentId, UserCreationStore);
    };

    refreshBounds(action);

    if (onClose) {
      onClose();
    }
  }, [onClose, componentId]);

  const change = useCallback(
    (newComponentSpecId: string) => {
      const action = () => {
        const newComponentId = createComponent(
          newComponentSpecId,
          UserCreationStore,
          ProductSpecificationStore
        );
        mountComponent(
          parentComponentId,
          parentMountingPointId,
          newComponentId,
          UserCreationStore,
          ProductSpecificationStore
        );

        EditorValuesStore.selectedComponentId = newComponentId;
      };

      refreshBounds(action);
    },
    [parentComponentId, parentMountingPointId]
  );

  return (
    <>
      <button
        className="other-button flex w-full items-center justify-center"
        onClick={() => setChangeModalOpen(true)}
      >
        <PencilIcon className="size-4" />
        <span className="ml-2">Change</span>
      </button>
      <HoldButton
        className="other-button destructive-button-on-hold flex w-full items-center justify-center"
        onSubmit={remove}
        duration={650}
        popoverPosition={"top-end"}
        popoverOffset={6}
      >
        <TrashIcon className="size-4" />
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
