import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Box3, Euler, Mesh, Vector3 } from "three";

import { PlacementControls } from "./PlacementControls.tsx";
import { PreviewMountingPoint } from "./PreviewMountingPoint.tsx";
import { useSelectedComponentSpec } from "../hooks/useSelectedComponentSpec.ts";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";
import { refreshBounds } from "../utilities/BoundsManipulation.ts";

export const PreviewModel = () => {
  const { componentSpecId, component } = useSelectedComponentSpec();

  const { scene, nodes, materials } = useGLTF("/kokos.glb");

  const groupRef = useRef(null);

  useEffect(() => {
    if (groupRef.current) {
      const boundingBox = new Box3().setFromObject(scene);
      const size = new Vector3();
      boundingBox.getSize(size);
      EditorValuesStore.boundingBoxSize = [
        size.x * (component.scaleOffset?.at(0) ?? 1),
        size.y * (component.scaleOffset?.at(1) ?? 1),
        size.z * (component.scaleOffset?.at(2) ?? 1),
      ];
    }

    return () => {
      EditorValuesStore.boundingBoxSize = undefined;
    };
  }, [scene, component.scaleOffset]);

  return (
    <>
      <PlacementControls
        currentPosition={
          component.positionOffset ? [...component.positionOffset] : [0, 0, 0]
        }
        currentRotation={
          component.rotationOffset ? [...component.rotationOffset] : [0, 0, 0]
        }
        updatePosition={(position) => {
          const editableComponent = ComponentsStore.components[componentSpecId];
          if (!editableComponent) {
            throw new Error(
              `No component specification with ${componentSpecId}`
            );
          }

          editableComponent.positionOffset = position;
        }}
        updateRotation={(rotation) => {
          const editableComponent = ComponentsStore.components[componentSpecId];
          if (!editableComponent) {
            throw new Error(
              `No component specification with ${componentSpecId}`
            );
          }

          editableComponent.rotationOffset = rotation;
        }}
        onManipulationEnd={() => {
          refreshBounds();
        }}
      >
        <group
          position={component.positionOffset}
          rotation={
            component.rotationOffset
              ? new Euler(...component.rotationOffset)
              : undefined
          }
          scale={component.scaleOffset}
          ref={groupRef}
        >
          {Object.entries(nodes).map(([name, node]) => {
            if (node.type === "Mesh") {
              const mesh = node as Mesh;

              const materialName = Array.isArray(mesh.material)
                ? mesh.material[0].name
                : mesh.material.name;
              const material = materials[materialName];

              return (
                <mesh key={name} geometry={mesh.geometry} material={material} />
              );
            }
            return null;
          })}
          {Object.keys(component.mountingPointsSpecs).map((mountingPointId) => {
            return (
              <group
                scale={
                  component.scaleOffset
                    ? (component.scaleOffset.map((scale) => 1 / scale) as [
                        number,
                        number,
                        number,
                      ])
                    : [1, 1, 1]
                }
                key={mountingPointId}
              >
                <PreviewMountingPoint mountingPointId={mountingPointId} />
              </group>
            );
          })}
        </group>
      </PlacementControls>
    </>
  );
};
