import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {useRef} from "react";
import {MeshStandardMaterial} from "three";

import {appConfig} from "../configurations/AppConfig.ts";

interface MountingPointButtonProps {
  id: string;
  position: readonly [number, number, number];
  onClick: (id: string) => void;
}

export const MountingPointButton = ({ id, position, onClick }: MountingPointButtonProps) => {
  const materialRef = useRef<MeshStandardMaterial>(null);
  const hoverRef = useRef(false);

  const updateColor = () => {
    if (materialRef.current) {
      materialRef.current.color.set(
        hoverRef.current ? appConfig.spacialUi.buttonColors.hover : appConfig.spacialUi.buttonColors.default
      );
    }
  };

  return (
    <mesh
      position={position}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        onClick(id);
        event.stopPropagation();
      }}
      onPointerEnter={(event: ThreeEvent<PointerEvent>) => {
        hoverRef.current = true;
        updateColor();
        event.stopPropagation();
      }}
      onPointerOut={(event: ThreeEvent<PointerEvent>) => {
        hoverRef.current = false;
        updateColor();
        event.stopPropagation();
      }}
    >

      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color={hoverRef.current ? appConfig.spacialUi.buttonColors.hover : appConfig.spacialUi.buttonColors.default}
        opacity={0.5}
        transparent={true} />
    </mesh>
  );
};
