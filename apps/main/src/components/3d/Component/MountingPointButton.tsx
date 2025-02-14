import { Modal } from "@3dwebprodconf/shared/src/components/containers/Modal.tsx";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as THREE from "three";
import { useSnapshot } from "valtio";

import { useComponent } from "../../../hooks/useComponent.ts";
import { UserCreationActions } from "../../../stores/actions/UserCreationActions.ts";
import { ConfiguratorValuesStore } from "../../../stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";
import { refreshBounds } from "../../../utilities/BoundsManipulation.ts";
import { willComponentCollide } from "../../../utilities/CollisionDetection.ts";
import { AddComponent } from "../../pages/ProductEditor/AddComponent/AddComponent.tsx";

interface MountingPointButtonProps {
  componentId: string;
  mountingPointSpecId: string;
}

export const MountingPointButton = ({
  componentId,
  mountingPointSpecId,
}: MountingPointButtonProps) => {
  const { t } = useTranslation();

  const configuratorValuesSnap = useSnapshot(ConfiguratorValuesStore);

  const [isModalOpen, setModalOpen] = useState(false);

  const { componentSpec, componentSpecId } = useComponent(componentId);

  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  const mountingPointSpec =
    componentSpec.mountingPointsSpecs[mountingPointSpecId];
  if (!mountingPointSpec) {
    throw new Error(
      t("errorMissingMountingPointOnComponentSpec", {
        mountingPointSpecId: mountingPointSpecId,
        componentSpecId: componentSpecId,
      })
    );
  }

  const [disabledComponents, setDisabledComponents] = useState<string[]>([]);

  const calculateCollisions = useCallback(() => {
    const worldPosition = new THREE.Vector3();
    const worldQuaternion = new THREE.Quaternion();
    const worldRotation = new THREE.Euler();

    if (groupRef.current) {
      groupRef.current.getWorldPosition(worldPosition);
      groupRef.current.getWorldQuaternion(worldQuaternion);
      worldRotation.setFromQuaternion(worldQuaternion, "XYZ");
    }
    const collisionChecks = mountingPointSpec.mountableComponents.map(
      async (mountableComponentSpec) => {
        const collision = await willComponentCollide(
          mountableComponentSpec,
          scene,
          worldPosition,
          worldRotation,
          [componentId]
        );
        return collision ? mountableComponentSpec : undefined;
      }
    );

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
  }, [componentId, mountingPointSpec.mountableComponents, scene]);

  const onAdd = (newComponentSpecId: string) => {
    const newComponentId = UserCreationActions.createComponent(
      newComponentSpecId,
      UserCreationStore.value,
      ProductSpecificationStore
    );
    UserCreationActions.mountComponent(
      componentId,
      mountingPointSpecId,
      newComponentId,
      UserCreationStore.value,
      ProductSpecificationStore
    );

    ConfiguratorValuesStore.selectedComponentId = newComponentId;

    refreshBounds(true);
  };

  return (
    <group ref={groupRef}>
      <Html zIndexRange={[50, 0]}>
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
            configuratorValuesSnap.selectedComponentId !== undefined &&
            configuratorValuesSnap.selectedComponentId !== componentId &&
            "opacity-30"
          }`}
          hidden={!configuratorValuesSnap.showMountingPoints}
        >
          <button
            className={`secondary-button ${mountingPointSpec.isRequired ? "outline outline-1 outline-offset-1 outline-red-400" : ""}`}
            onClick={() => {
              calculateCollisions();
              setModalOpen(true);
            }}
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <AddComponent
            mountableComponentsSpecs={mountingPointSpec.mountableComponents}
            disabledComponentSpecs={disabledComponents}
            onClose={() => setModalOpen(false)}
            onAdd={onAdd}
          />
        </Modal>
      </Html>
    </group>
  );
};
