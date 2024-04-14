import { Bvh } from "@react-three/drei";
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
    <group name={componentId}>
      <Bvh>
        <ComponentModel componentId={componentId} />
      </Bvh>

      {Object.entries(componentSpec.mountingPointsSpecs).map(
        ([mountingPointSpecId, mountingPoint]) => {
          const mountedComponentId = component.mounted[mountingPointSpecId];

          return (
            <group
              key={mountingPointSpecId}
              position={mountingPoint.position}
              rotation={new Euler(...mountingPoint.rotation)}
            >
              {mountedComponentId ? (
                <Component componentId={mountedComponentId} />
              ) : (
                <MountingPointButton
                  componentId={componentId}
                  mountingPointSpecId={mountingPointSpecId}
                />
              )}
            </group>
          );
        }
      )}
    </group>
  );
};
