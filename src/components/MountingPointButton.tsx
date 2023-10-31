import {useThree} from "@react-three/fiber";
import {useRef, useState} from "react";
import {Mesh} from "three";

interface MountingPointButtonProps {
  id: string;
  position: readonly [number, number, number];
  onClick: (id: string) => void;
}

export const MountingPointButton = ({ id, position, onClick }: MountingPointButtonProps) => {
  const { viewport } = useThree();
  const meshRef = useRef<Mesh>(null);
  const [hover, setHover] = useState(false);

  // This scales the button size based on the viewport.
  const scale = viewport.width / 15;

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={() => onClick(id)}
      onPointerOver={(event) => {
        setHover(true);
        event.stopPropagation();
      }}
      onPointerOut={(event) => {
        setHover(false);
        event.stopPropagation();
      }}
    >

      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        color={hover ? "#3377ff" : "#0011ff"}
        opacity={0.5}
        transparent={true} />
    </mesh>
  );
};
