import {PlusIcon} from "@heroicons/react/20/solid";
import {Html} from "@react-three/drei";
import {useState} from "react";

import {AddComponent} from "../2d/AddComponent.tsx";
import {Modal} from "../2d/containers/Modal.tsx";

interface MountingPointButtonProps {
  position: readonly [number, number, number]
  isRequired: boolean
  mountableComponentsSpecs: readonly string[]
  add: (id: string) => void
}

export const MountingPointButton = ({ position, isRequired, mountableComponentsSpecs, add }: MountingPointButtonProps) => {

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Html position={position} zIndexRange={[50, 0]}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          className={`secondary-button ${ isRequired ? "outline outline-1 outline-offset-1 outline-red-400" : "" }`}
          onClick={() => setModalOpen(true)}>
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AddComponent
          mountableComponentsSpecs={mountableComponentsSpecs}
          onClose={() => setModalOpen(false)}
          add={add} />
      </Modal>
    </Html>
  );
};
