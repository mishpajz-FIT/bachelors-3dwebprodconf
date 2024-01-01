import {PlusIcon} from "@heroicons/react/20/solid";
import {Html} from "@react-three/drei";
import {useState} from "react";

import {ComponentMount} from "../2d/ComponentMount.tsx";
import {Modal} from "../2d/Modal.tsx";

interface MountingPointButtonProps {
  position: readonly [number, number, number]
  isRequired: boolean
  mountableComponents: readonly string[]
  add: (id: string) => void
}

export const MountingPointButton = ({ position, isRequired, mountableComponents, add }: MountingPointButtonProps) => {

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Html position={position} zIndexRange={[50, 0]}>
      <button
        className={`secondary-button ${ isRequired ? "outline outline-1 outline-offset-1 outline-red-400" : "" }`}
        onClick={() => setModalOpen(true)}>
        <PlusIcon className="h-4 w-4" />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ComponentMount
          mountableComponents={mountableComponents}
          close={() => setModalOpen(false)}
          add={add} />
      </Modal>
    </Html>
  );
};
