import { lazy } from "react";
import { Euler } from "three";
import { useSnapshot } from "valtio";

import { MountingPointButton } from "./MountingPointButton.tsx";
import { ProductSpecificationStore } from "../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";

const ComponentModel = lazy(() => import("./ComponentModel.tsx"));

interface ComponentProps {
  componentId: string;
}

export const Component = ({ componentId }: ComponentProps) => {
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

  return (
    <group
      position={componentSpec.positionOffset}
      rotation={
        componentSpec.rotationOffset
          ? new Euler(...componentSpec.rotationOffset)
          : undefined
      }
    >
      <ComponentModel componentId={componentId} />

      {Object.entries(componentSpec.mountingPointsSpecs).map(
        ([mountingPointSpecId, mountingPoint]) => {
          const mountedComponentId = component.mounted[mountingPointSpecId];

          if (mountedComponentId) {
            return (
              <group
                key={mountedComponentId}
                position={mountingPoint.position}
                rotation={new Euler(...mountingPoint.rotation)}
              >
                <Component componentId={mountedComponentId} />
              </group>
            );
          } else {
            return (
              <group
                key={mountingPointSpecId}
                position={mountingPoint.position}
                rotation={new Euler(...mountingPoint.rotation)}
              >
                <MountingPointButton
                  componentId={componentId}
                  mountingPointSpecId={mountingPointSpecId}
                />
              </group>
            );
          }
        }
      )}
    </group>
  );
};
