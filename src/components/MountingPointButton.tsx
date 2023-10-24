import { useThree } from "@react-three/fiber";

interface MountingPointButtonProps {
  id: string;
  position: [number, number, number];
  onClick: (id: string) => void;
}

export const MountingPointButton = ({ id, position, onClick }: MountingPointButtonProps) => {
  const { viewport } = useThree();

  // This scales the button size based on the viewport. You can adjust this calculation as needed.
  const scale = viewport.width / 10;

  return (
    <mesh position={position} scale={[scale, scale, scale]} onClick={() => onClick(id)}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};