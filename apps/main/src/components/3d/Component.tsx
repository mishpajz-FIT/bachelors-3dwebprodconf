import { lazy } from "react";
import { Euler, MathUtils } from "three";
import { useSnapshot } from "valtio";

import { MountingPointButton } from "./MountingPointButton.tsx";
import { ProductSpecificationStore } from "../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../stores/UserCreationStore.ts";

const ComponentModel = lazy(() => import("./ComponentModel.tsx"));

interface ComponentProps {
  componentId: string;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
}

const nullCoordinates: [number, number, number] = [0, 0, 0];

export const Component = ({
  componentId,
  position = nullCoordinates,
  rotation = nullCoordinates,
}: ComponentProps) => {
  const userCreationSnap = useSnapshot(ProductSpecificationStore);
  const userProductSnap = useSnapshot(UserCreationStore);

  const component = userProductSnap.components[componentId];
  if (!component) {
    throw new Error(`Component ${componentId} not found!`);
  }

  const componentSpec =
    userCreationSnap.componentSpecs[component.componentSpec];
  if (!componentSpec) {
    throw new Error(`Component specs ${component.componentSpec} not found!`);
  }

  const [rotationX, rotationY, rotationZ] = rotation;
  const radiansRotation = new Euler(
    MathUtils.degToRad(rotationX),
    MathUtils.degToRad(rotationY),
    MathUtils.degToRad(rotationZ),
    "XYZ"
  );

  return (
    <group position={position} rotation={radiansRotation}>
      <ComponentModel componentId={componentId} position={nullCoordinates} />

      {Object.entries(componentSpec.mountingPointsSpecs).map(
        ([mountingPointSpecId, mp]) => {
          const mountedComponentId = component.mounted[mountingPointSpecId];

          if (mountedComponentId) {
            return (
              <Component
                key={mountedComponentId}
                componentId={mountedComponentId}
                position={mp.position}
                rotation={mp.rotation}
              />
            );
          } else {
            return (
              <MountingPointButton
                key={mountingPointSpecId}
                componentId={componentId}
                mountingPointSpecId={mountingPointSpecId}
              />
            );
          }
        }
      )}
    </group>
  );
};
