import { Bvh, Html } from "@react-three/drei";
import { lazy } from "react";
import { Euler } from "three";
import { snapshot } from "valtio";

import { MountingPointButton } from "./MountingPointButton.tsx";
import { useComponent } from "../../../hooks/useComponent.ts";
import { ConfiguratorValuesStore } from "../../../stores/ConfiguratorValuesStore.ts";

const ComponentModel = lazy(() => import("./ComponentModel.tsx"));

interface ComponentProps {
  componentId: string;
}

export const Component = ({ componentId }: ComponentProps) => {
  const configuratorValuesSnap = snapshot(ConfiguratorValuesStore);

  const { component, componentSpec } = useComponent(componentId);

  return (
    <group name={componentId}>
      {componentSpec.ignoreCollisions ? (
        <ComponentModel componentId={componentId} />
      ) : (
        <Bvh indirect={true}>
          <ComponentModel componentId={componentId} />
        </Bvh>
      )}

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
                <>
                  <Component componentId={mountedComponentId} />
                  <Html zIndexRange={[50, 0]}>
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      hidden={!configuratorValuesSnap.showMountingPoints}
                    >
                      <button
                        className="size-3 cursor-pointer rounded-full border border-gray-300 bg-[var(--primary-light)] dark:border-zinc-700 dark:bg-[var(--primary-dark)]"
                        onClick={(event) => {
                          event.stopPropagation();
                          ConfiguratorValuesStore.selectedComponentId =
                            mountedComponentId;
                        }}
                      ></button>
                    </div>
                  </Html>
                </>
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
