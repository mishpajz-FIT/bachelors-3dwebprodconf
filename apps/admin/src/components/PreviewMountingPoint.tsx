import { Html } from "@react-three/drei";
import { Euler } from "three";
import { useSnapshot } from "valtio";

import { PlacementControls } from "./PlacementControls.tsx";
import { PreviewMountedModel } from "./PreviewMountedModel.tsx";
import { useSelectedComponentSpec } from "../hooks/useSelectedComponentSpec.ts";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

interface PreviewMountingPointProps {
  mountingPointId: string;
}

export const PreviewMountingPoint = ({
  mountingPointId,
}: PreviewMountingPointProps) => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);
  const { componentSpec, componentSpecId } = useSelectedComponentSpec();

  const mountingPoint = componentSpec.mountingPointsSpecs[mountingPointId];
  if (!mountingPoint) {
    throw new Error(
      `No mounting point specification with ${mountingPointId} on component ${componentSpecId}`
    );
  }

  return (
    <>
      {editorValuesSnap.selectedMountingPoint === mountingPointId ? (
        <PlacementControls
          currentPosition={[...mountingPoint.position]}
          currentRotation={[...mountingPoint.rotation]}
          updatePosition={(position) => {
            const editableMountingPoint =
              ComponentsStore.components[componentSpecId].mountingPointsSpecs[
                mountingPointId
              ];
            if (!editableMountingPoint) {
              throw new Error(
                `No mounting point specification with ${mountingPointId} on component ${componentSpecId}`
              );
            }

            editableMountingPoint.position = position;
          }}
          updateRotation={(rotation) => {
            const editableMountingPoint =
              ComponentsStore.components[componentSpecId].mountingPointsSpecs[
                mountingPointId
              ];
            if (!editableMountingPoint) {
              throw new Error(
                `No mounting point specification with ${mountingPointId} on component ${componentSpecId}`
              );
            }

            editableMountingPoint.rotation = rotation;
          }}
          onManipulationEnd={() => undefined}
        >
          <group
            position={mountingPoint.position}
            rotation={new Euler(...mountingPoint.rotation)}
          >
            <Html zIndexRange={[50, 0]}>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="simple-panel pointer-events-none select-none p-2 font-mono text-sm">
                  {mountingPointId}
                </div>
              </div>
            </Html>

            {editorValuesSnap.previewedMountedComponent !== undefined && (
              <PreviewMountedModel />
            )}
          </group>
        </PlacementControls>
      ) : (
        <group
          position={mountingPoint.position}
          rotation={new Euler(...mountingPoint.rotation)}
        >
          <Html zIndexRange={[50, 0]} occlude={true}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="simple-panel pointer-events-none select-none p-2 font-mono text-sm">
                {mountingPointId}
              </div>
            </div>
          </Html>
        </group>
      )}
    </>
  );
};
