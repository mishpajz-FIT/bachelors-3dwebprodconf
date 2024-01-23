import { PlusIcon } from "@heroicons/react/20/solid";
import { Html } from "@react-three/drei";
import { useCallback, useState } from "react";
import { useSnapshot } from "valtio";

import { manipulateCanvas } from "../../providers/CanvasManipulation.ts";
import {
  createNewComponent,
  mountComponent,
} from "../../stores/actions/UserProductActions.ts";
import { ProductSpecificationStore } from "../../stores/ProductSpecificationStore.ts";
import { UserProductStore } from "../../stores/UserProductStore.ts";
import { AddComponent } from "../2d/concrete/ProductEditor/AddComponent/AddComponent.tsx";
import { Modal } from "../2d/universal/containers/Modal.tsx";

interface MountingPointButtonProps {
  componentId: string;
  mountingPointSpecId: string;
}

export const MountingPointButton = ({
  componentId,
  mountingPointSpecId,
}: MountingPointButtonProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const userProductSnap = useSnapshot(UserProductStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

  const component = userProductSnap.components[componentId];
  if (!component) {
    throw new Error(`Component ${componentId} not found!`);
  }

  const componentSpec =
    productSpecsSnap.componentSpecs[component.componentSpec];
  if (!componentSpec) {
    throw new Error(`Component specs ${component.componentSpec} not found!`);
  }

  const mountingPointSpec =
    componentSpec.mountingPointsSpecs[mountingPointSpecId];
  if (!mountingPointSpec) {
    throw new Error(
      `Mounting point specs ${mountingPointSpecId} on component specs ${component.componentSpec} not found!`
    );
  }

  const add = useCallback(
    (newComponentSpecId: string) => {
      const action = () => {
        const newComponentId = createNewComponent(newComponentSpecId);
        mountComponent(componentId, mountingPointSpecId, newComponentId);
      };

      manipulateCanvas(action);
    },
    [componentId, mountingPointSpecId]
  );

  return (
    <Html position={mountingPointSpec.position} zIndexRange={[50, 0]}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          className={`secondary-button ${mountingPointSpec.isRequired ? "outline outline-1 outline-offset-1 outline-red-400" : ""}`}
          onClick={() => setModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddComponent
          mountableComponentsSpecs={mountingPointSpec.mountableComponents}
          onClose={() => setModalOpen(false)}
          add={add}
        />
      </Modal>
    </Html>
  );
};
