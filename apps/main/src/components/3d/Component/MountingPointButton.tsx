import { Modal } from "@3dwebprodconf/shared/src/components/containers/Modal.tsx";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Html } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";

import { useComponent } from "../../../hooks/useComponent.ts";
import { UserCreationActions } from "../../../stores/actions/UserCreationActions.ts";
import { ConfiguratorValuesStore } from "../../../stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";
import { refreshBounds } from "../../../utilities/BoundsManipulation.ts";
import { AddComponent } from "../../pages/ProductEditor/AddComponent/AddComponent.tsx";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { willComponentCollide } from "../../../utilities/CollisionDetection.ts";

interface MountingPointButtonProps {
  componentId: string;
  mountingPointSpecId: string;
}

export const MountingPointButton = ({
  componentId,
  mountingPointSpecId,
}: MountingPointButtonProps) => {
  const configuratorValuesSnap = useSnapshot(ConfiguratorValuesStore);

  const [isModalOpen, setModalOpen] = useState(false);

  const { component, componentSpec, componentSpecId } =
    useComponent(componentId);

  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  const mountingPointSpec =
    componentSpec.mountingPointsSpecs[mountingPointSpecId];
  if (!mountingPointSpec) {
    throw new Error(
      `Mounting point spec not found ${mountingPointSpecId} on component spec ${component.componentSpec}.`
    );
  }

  useEffect(() => {
    if (groupRef.current) {
      const worldPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPosition);

      const worldQuaternion = new THREE.Quaternion();
      groupRef.current.getWorldQuaternion(worldQuaternion);

      const worldRotation = new THREE.Euler().setFromQuaternion(
        worldQuaternion,
        "XYZ"
      );

      willComponentCollide(componentSpecId, scene, worldPosition, worldRotation)
        .then((b) => {
          console.log(`${componentSpecId} collides: ${b}`);
        })
        .catch((e) => {
          throw e;
        });
    }
  }, [componentSpecId, scene]);

  const onAdd = (newComponentSpecId: string) => {
    const action = () => {
      const newComponentId = UserCreationActions.createComponent(
        newComponentSpecId,
        UserCreationStore,
        ProductSpecificationStore
      );
      UserCreationActions.mountComponent(
        componentId,
        mountingPointSpecId,
        newComponentId,
        UserCreationStore,
        ProductSpecificationStore
      );
    };

    refreshBounds(action);
  };

  return (
    <group ref={groupRef}>
      <Html zIndexRange={[50, 0]}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          hidden={
            configuratorValuesSnap.selectedComponentId !== undefined &&
            configuratorValuesSnap.selectedComponentId !== componentId
          }
        >
          <button
            className={`secondary-button ${mountingPointSpec.isRequired ? "outline outline-1 outline-offset-1 outline-red-400" : ""}`}
            onClick={() => setModalOpen(true)}
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <AddComponent
            mountableComponentsSpecs={mountingPointSpec.mountableComponents}
            onClose={() => setModalOpen(false)}
            onAdd={onAdd}
          />
        </Modal>
      </Html>
    </group>
  );
};
