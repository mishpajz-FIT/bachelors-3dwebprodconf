import { Modal } from "@3dwebprodconf/shared/src/components/containers/Modal.tsx";
import { HoldButton } from "@3dwebprodconf/shared/src/components/HoldButton.tsx";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import * as THREE from "three";
import { useSnapshot } from "valtio";

import { useComponent } from "../../../../../hooks/useComponent.ts";
import { UserCreationActions } from "../../../../../stores/actions/UserCreationActions.ts";
import {
  ConfiguratorValuesNonReactiveStore,
  ConfiguratorValuesStore,
} from "../../../../../stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "../../../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../../../stores/UserCreationStore.ts";
import { refreshBounds } from "../../../../../utilities/BoundsManipulation.ts";
import { willComponentCollide } from "../../../../../utilities/CollisionDetection.ts";
import { AddComponent } from "../../AddComponent/AddComponent.tsx";

const worldPosition = new THREE.Vector3();
const worldQuaternion = new THREE.Quaternion();
const worldRotation = new THREE.Euler();

interface EditComponentControlsProps {
  componentId: string;
  onClose?: () => void;
}

export const EditComponentControls = ({
  componentId,
  onClose,
}: EditComponentControlsProps) => {
  const { t } = useTranslation();

  const userCreationSnap = useSnapshot(UserCreationStore);

  const [isChangeModalOpen, setChangeModalOpen] = useState(false);

  const parentInfo = userCreationSnap.value.childToParentMap[componentId];
  if (!parentInfo) {
    throw Error(t("errorHierarchyDamaged", { componentId: componentId }));
  }
  const [parentComponentId, parentMountingPointId] = parentInfo;

  const { componentSpec: parentComponentSpec } =
    useComponent(parentComponentId);

  const mountableComponents =
    parentComponentSpec.mountingPointsSpecs[parentMountingPointId]
      .mountableComponents;

  const [disabledComponents, setDisabledComponents] = useState<string[]>([]);

  const calculateCollisions = useCallback(() => {
    const scene = ConfiguratorValuesNonReactiveStore.scene;
    if (!scene) {
      return;
    }

    const group = ConfiguratorValuesNonReactiveStore.currentGroup;
    if (group) {
      group.getWorldPosition(worldPosition);
      group.getWorldQuaternion(worldQuaternion);
      worldRotation.setFromQuaternion(worldQuaternion, "XYZ");
    } else {
      setDisabledComponents([]);
      return;
    }

    const collisionChecks = parentComponentSpec.mountingPointsSpecs[
      parentMountingPointId
    ].mountableComponents.map(async (mountableComponentSpec) => {
      const collision = await willComponentCollide(
        mountableComponentSpec,
        scene,
        worldPosition,
        worldRotation,
        [componentId, parentComponentId]
      );
      return collision ? mountableComponentSpec : undefined;
    });

    Promise.all(collisionChecks)
      .then((results) => {
        const filteredComponents = results.filter(
          (result): result is string => result !== null
        );
        setDisabledComponents(filteredComponents);
      })
      .catch((e) => {
        throw e;
      });
  }, [
    componentId,
    parentComponentId,
    parentComponentSpec.mountingPointsSpecs,
    parentMountingPointId,
  ]);

  const handleRemove = () => {
    UserCreationActions.removeComponent(componentId, UserCreationStore.value);
    onClose?.();

    refreshBounds(true);
  };

  const handleChange = (newComponentSpecId: string) => {
    const newComponentId = UserCreationActions.createComponent(
      newComponentSpecId,
      UserCreationStore.value,
      ProductSpecificationStore
    );
    UserCreationActions.mountComponent(
      parentComponentId,
      parentMountingPointId,
      newComponentId,
      UserCreationStore.value,
      ProductSpecificationStore
    );
    ConfiguratorValuesStore.selectedComponentId = undefined;

    refreshBounds(true);
  };

  return (
    <>
      <button
        className="other-button flex w-full items-center justify-center"
        onClick={() => {
          calculateCollisions();
          setChangeModalOpen(true);
        }}
      >
        <PencilIcon className="size-4" />
        <span className="ml-2">{t("change")}</span>
      </button>
      <HoldButton
        className="other-button destructive-button-on-hold flex w-full items-center justify-center"
        onSubmit={handleRemove}
        duration={650}
        popoverPosition={"top-end"}
        popoverOffset={6}
      >
        <TrashIcon className="size-4" />
        <span className="ml-2">{t("remove")}</span>
      </HoldButton>
      <Modal
        isOpen={isChangeModalOpen}
        onClose={() => setChangeModalOpen(false)}
      >
        <AddComponent
          mountableComponentsSpecs={mountableComponents}
          disabledComponentSpecs={disabledComponents}
          onClose={() => setChangeModalOpen(false)}
          onAdd={handleChange}
        />
      </Modal>
    </>
  );
};
