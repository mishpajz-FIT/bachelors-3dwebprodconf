import { PivotControls } from "@react-three/drei";
import { ReactNode, useState } from "react";
import { Euler, Quaternion, Vector3 } from "three";

interface PlacementControlsProps {
  currentPosition: [number, number, number];
  currentRotation: [number, number, number];
  currentScale?: [number, number, number];
  onManipulationEnd: () => void;
  updatePosition: (position: [number, number, number]) => void;
  updateRotation: (rotation: [number, number, number]) => void;
  updateScale?: (scale: [number, number, number]) => void;
  axisColors?: [string, string, string];
  hidden?: boolean;
  children?: ReactNode;
}

export const PlacementControls = ({
  currentPosition,
  currentRotation,
  currentScale,
  onManipulationEnd,
  updatePosition,
  updateRotation,
  updateScale,
  axisColors = ["#DC143C", "#00FF7F", "#1E90FF"],
  hidden,
  children,
}: PlacementControlsProps) => {
  const [dragPosition, setDragPosition] =
    useState<[number, number, number]>(currentPosition);
  const [dragRotation, setDragRotation] =
    useState<[number, number, number]>(currentRotation);
  const [dragScale, setDragScale] = useState(currentScale);

  if (hidden) return children;

  return (
    <PivotControls
      depthTest={false}
      fixed={true}
      scale={100}
      axisColors={axisColors}
      offset={currentPosition}
      rotation={currentRotation}
      autoTransform={false}
      onDragStart={() => {
        setDragPosition(currentPosition);
        setDragRotation(currentRotation);
        setDragScale(currentScale);
      }}
      disableScaling={!currentScale || !setDragScale}
      onDrag={(w) => {
        const position = new Vector3();
        const scale = new Vector3();
        const quaternion = new Quaternion();
        w.decompose(position, quaternion, scale);

        if (quaternion.x === 0 && quaternion.y === 0 && quaternion.z === 0) {
          updatePosition([
            position.x + dragPosition[0],
            position.y + dragPosition[1],
            position.z + dragPosition[2],
          ]);
        } else {
          const currentRotationQuaternion = new Quaternion().setFromEuler(
            new Euler().fromArray(dragRotation)
          );

          const rotation = new Euler().setFromQuaternion(
            quaternion.multiply(currentRotationQuaternion)
          );
          updateRotation([rotation.x, rotation.y, rotation.z]);
        }

        if (dragScale && updateScale !== undefined) {
          updateScale([
            dragScale[0] * scale.x,
            dragScale[1] * scale.y,
            dragScale[2] * scale.z,
          ]);
        }
      }}
      onDragEnd={onManipulationEnd}
    >
      {children}
    </PivotControls>
  );
};
