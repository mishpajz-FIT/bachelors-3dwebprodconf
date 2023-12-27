import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {useRef, useState} from "react";
import {Mesh} from "three";

import {appConfig} from "../configurations/AppConfig.ts";

interface MountingPointButtonProps {
  id: string;
  position: readonly [number, number, number];
  onClick: (id: string) => void;
}

export const MountingPointButton = ({ id, position, onClick }: MountingPointButtonProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hover, setHover] = useState(false);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        onClick(id);
        event.stopPropagation();
      }}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        setHover(true);
        event.stopPropagation();
      }}
      onPointerOut={(event: ThreeEvent<PointerEvent>) => {
        setHover(false);
        event.stopPropagation();
      }}
    >

      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        color={hover ? appConfig.spacialUi.buttonColors.hover : appConfig.spacialUi.buttonColors.default}
        opacity={0.5}
        transparent={true} />
    </mesh>
  );
};
