import {PlusIcon} from "@heroicons/react/20/solid";
import {Html} from "@react-three/drei";
import {useState} from "react";

import {ComponentMount} from "../2d/ComponentMount.tsx";
import {Modal} from "../2d/Modal.tsx";

interface MountingPointButtonProps {
  id: string;
  position: readonly [number, number, number];
  add: (id: string) => void;
}

export const MountingPointButton = ({ id, position, add }: MountingPointButtonProps) => {

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Html position={position}>
      <button className="secondary-button" onClick={() => setModalOpen(true)}>
        <PlusIcon className="h-4 w-4" />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ComponentMount closeModal={() => setModalOpen(false)} />
      </Modal>
    </Html>
  );
};
