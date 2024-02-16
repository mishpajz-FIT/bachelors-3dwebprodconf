import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Box3, Euler, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { useSnapshot } from "valtio";

import { PlacementControls } from "./PlacementControls.tsx";
import { PreviewMountingPoint } from "./PreviewMountingPoint.tsx";
import { useSelectedComponentSpec } from "../hooks/useSelectedComponentSpec.ts";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";
import { refreshBounds } from "../utilities/BoundsManipulation.ts";

export const PreviewModel = () => {
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const { scene, nodes, materials } = useGLTF("/kokos.glb");

  const groupRef = useRef(null);

  const selectedMaterial = new MeshBasicMaterial({ color: 0x3377ff });

  useEffect(() => {
    if (groupRef.current) {
      const boundingBox = new Box3().setFromObject(scene);
      const size = new Vector3();
      boundingBox.getSize(size);
      EditorValuesStore.boundingBoxSize = [
        size.x * (componentSpec.scaleOffset?.at(0) ?? 1),
        size.y * (componentSpec.scaleOffset?.at(1) ?? 1),
        size.z * (componentSpec.scaleOffset?.at(2) ?? 1),
      ];
    }

    return () => {
      EditorValuesStore.boundingBoxSize = undefined;
    };
  }, [scene, componentSpec.scaleOffset]);

  return (
    <>
      <PlacementControls
        currentPosition={
          componentSpec.positionOffset
            ? [...componentSpec.positionOffset]
            : [0, 0, 0]
        }
        currentRotation={
          componentSpec.rotationOffset
            ? [...componentSpec.rotationOffset]
            : [0, 0, 0]
        }
        updatePosition={(position) => {
          const editableComponent = ComponentsStore.components[componentSpecId];

          editableComponent.positionOffset = position;
        }}
        updateRotation={(rotation) => {
          const editableComponent = ComponentsStore.components[componentSpecId];

          editableComponent.rotationOffset = rotation;
        }}
        onManipulationEnd={() => {
          refreshBounds();
        }}
      >
        <group
          position={componentSpec.positionOffset}
          rotation={
            componentSpec.rotationOffset
              ? new Euler(...componentSpec.rotationOffset)
              : undefined
          }
          scale={componentSpec.scaleOffset}
          ref={groupRef}
        >
          {Object.entries(nodes).map(([name, node]) => {
            if (node.type === "Mesh") {
              const mesh = node as Mesh;

              const materialName = Array.isArray(mesh.material)
                ? mesh.material[0].name
                : mesh.material.name;

              let material = materials[materialName];
              if (editorValuesSnap.selectedMaterial) {
                const materialSpec =
                  componentSpec.materialSpecs[
                    editorValuesSnap.selectedMaterial
                  ];
                if (materialSpec.modelMaterials.includes(materialName)) {
                  material = selectedMaterial;
                }
              }

              return (
                <mesh key={name} geometry={mesh.geometry} material={material} />
              );
            }
            return null;
          })}
          {Object.keys(componentSpec.mountingPointsSpecs).map(
            (mountingPointId) => {
              return (
                <group
                  scale={
                    componentSpec.scaleOffset
                      ? (componentSpec.scaleOffset.map((s) => 1 / s) as [
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
            }
          )}
        </group>
      </PlacementControls>
    </>
  );
};
