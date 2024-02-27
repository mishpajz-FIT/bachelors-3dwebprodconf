import { lazy } from "react";
import { Euler } from "three";

import { MountingPointButton } from "./MountingPointButton.tsx";
import { useComponent } from "../../../hooks/useComponent.ts";

const ComponentModel = lazy(() => import("./ComponentModel.tsx"));

interface ComponentProps {
  componentId: string;
}

export const Component = ({ componentId }: ComponentProps) => {
  const { component, componentSpec } = useComponent(componentId);

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
