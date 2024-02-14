import { PivotControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Box3, Euler, Mesh, Quaternion, Vector3 } from "three";
import { useSnapshot } from "valtio";

import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";

const toMutableArray = (
  arr?: readonly [number, number, number]
): [number, number, number] | undefined => {
  return arr ? [...arr] : undefined;
};

export const PreviewModel = () => {
  const componentsSnap = useSnapshot(ComponentsStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentSpecId = editorValuesSnap.selectedComponentSpec;
  if (!componentSpecId) {
    throw new Error(`No selected component ${componentSpecId}`);
  }

  const component = componentsSnap.components[componentSpecId];
  if (!component) {
    throw new Error(`Missing component ${componentSpecId}`);
  }

  const { scene, nodes, materials } = useGLTF("/kokos.glb");

  const [dragPosition, setDragPosition] = useState<[number, number, number]>(
    toMutableArray(component.positionOffset) ?? [0, 0, 0]
  );
  const [dragRotation, setDragRotation] = useState<[number, number, number]>(
    toMutableArray(component.rotationOffset) ?? [0, 0, 0]
  );

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
      <PivotControls
        depthTest={false}
        fixed={true}
        scale={100}
        axisColors={["#DC143C", "#00FF7F", "#1E90FF"]}
        offset={toMutableArray(component.positionOffset)}
        rotation={toMutableArray(component.rotationOffset)}
        autoTransform={false}
        onDragStart={() => {
          const editableComponent = ComponentsStore.components[componentSpecId];
          if (!editableComponent.positionOffset) {
            editableComponent.positionOffset = [0, 0, 0];
          }
          if (!editableComponent.rotationOffset) {
            editableComponent.rotationOffset = [0, 0, 0];
          }

          setDragPosition(editableComponent.positionOffset);
          setDragRotation(editableComponent.rotationOffset);
        }}
        onDrag={(w) => {
          const position = new Vector3();
          const scale = new Vector3();
          const quaternion = new Quaternion();
          w.decompose(position, quaternion, scale);

          const editableComponent = ComponentsStore.components[componentSpecId];
          if (!editableComponent) {
            throw new Error(
              `No component specification with ${componentSpecId}`
            );
          }

          if (quaternion.x === 0 && quaternion.y === 0 && quaternion.z === 0) {
            editableComponent.positionOffset = [
              position.x + dragPosition[0],
              position.y + dragPosition[1],
              position.z + dragPosition[2],
            ];
          } else {
            const currentRotationQuaternion = new Quaternion().setFromEuler(
              new Euler().fromArray(dragRotation)
            );

            const rotation = new Euler().setFromQuaternion(
              quaternion.multiply(currentRotationQuaternion)
            );
            editableComponent.rotationOffset = [
              rotation.x,
              rotation.y,
              rotation.z,
            ];
          }
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
        </group>
      </PivotControls>
    </>
  );
};
