import { Modal } from "@3dwebprodconf/shared/src/components/containers/Modal.tsx";
import { HoldButton } from "@3dwebprodconf/shared/src/components/HoldButton.tsx";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useSnapshot } from "valtio";

import { useComponent } from "../../../../../hooks/useComponent.ts";
import { UserCreationActions } from "../../../../../stores/actions/UserCreationActions.ts";
import { ConfiguratorValuesStore } from "../../../../../stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "../../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../../stores/UserCreationStore.ts";
import { refreshBounds } from "../../../../../utilities/BoundsManipulation.ts";
import { AddComponent } from "../../AddComponent/AddComponent.tsx";

interface EditComponentControlsProps {
  componentId: string;
  onClose?: () => void;
}
export const EditComponentControls = ({
  componentId,
  onClose,
}: EditComponentControlsProps) => {
  const userCreationSnap = useSnapshot(UserCreationStore);

  const [isChangeModalOpen, setChangeModalOpen] = useState(false);

  const parentInfo = userCreationSnap.value.childToParentMap[componentId];
  if (!parentInfo) {
    throw Error(
      "Component hierarchy is damaged, component does not have parent component!"
    );
  }
  const [parentComponentId, parentMountingPointId] = parentInfo;

  const { componentSpec: parentComponentSpec } =
    useComponent(parentComponentId);

  const handleRemove = () => {
    refreshBounds(() => {
      UserCreationActions.removeComponent(componentId, UserCreationStore);
    });

    onClose?.();
  };

  const handleChange = (newComponentSpecId: string) => {
    const action = () => {
      const newComponentId = UserCreationActions.createComponent(
        newComponentSpecId,
        UserCreationStore,
        ProductSpecificationStore
      );
      UserCreationActions.mountComponent(
        parentComponentId,
        parentMountingPointId,
        newComponentId,
        UserCreationStore,
        ProductSpecificationStore
      );

      ConfiguratorValuesStore.selectedComponentId = newComponentId;
    };

    refreshBounds(action);
  };

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
        onSubmit={handleRemove}
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
          onAdd={handleChange}
        />
      </Modal>
    </>
  );
};
