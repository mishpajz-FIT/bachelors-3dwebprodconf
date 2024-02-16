import { useSnapshot } from "valtio";
import { ComponentsStore } from "../stores/ComponentsStore.ts";
import { EditorValuesStore } from "../stores/EditorValuesStore.ts";
import { useGLTF } from "@react-three/drei";
import { Euler, Mesh } from "three";

export const PreviewMountedModel = () => {
  const componentsSnap = useSnapshot(ComponentsStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  if (!editorValuesSnap.previewedMountedComponent) {
    throw Error(`No previewed mounted component`);
  }

  const previewedMountedComponent =
    componentsSnap.components[editorValuesSnap.previewedMountedComponent];
  if (!previewedMountedComponent) {
    throw Error(
      `Missing component ${editorValuesSnap.previewedMountedComponent}`
    );
  }

  const { nodes } = useGLTF("/kokos.glb");

  return (
    <group
      position={previewedMountedComponent.positionOffset}
      rotation={
        previewedMountedComponent.rotationOffset
          ? new Euler(...previewedMountedComponent.rotationOffset)
          : undefined
      }
      scale={previewedMountedComponent.scaleOffset}
    >
      {Object.entries(nodes).map(([name, node]) => {
        if (node.type === "Mesh") {
          const mesh = node as Mesh;

          return (
            <mesh key={name} geometry={mesh.geometry}>
              <meshBasicMaterial opacity={0.5} transparent color={"#3377ff"} />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
};
