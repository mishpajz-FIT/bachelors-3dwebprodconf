import {Edges, useGLTF} from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import {Mesh} from "three";
import {useSnapshot} from "valtio";

import {appConfig} from "../../configurations/AppConfig.ts";
import {EditorValuesStore} from "../../stores/EditorValuesStore.ts";
import {ProductOptionsStore} from "../../stores/ProductOptionsStore.ts";
import {UserProductStore} from "../../stores/UserProductStore.ts";

interface GLTFRendererProps {
  componentId: string;
  position: [number, number, number];
  onClick: (event: ThreeEvent<MouseEvent>) => void;
}
export const GLTFRenderer = ({ componentId, position, onClick }: GLTFRendererProps) => {
  const userProductSnap = useSnapshot(UserProductStore);
  const productOptionsSnap = useSnapshot(ProductOptionsStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentProductId = userProductSnap.components[componentId].componentProductId;
  const component = productOptionsSnap.components.get(componentProductId);

  if (!component) {
    throw `Component ${componentProductId} could not be found.`;
  }

  const { nodes, materials } = useGLTF(component.modelUrl);

  return (
    <group position={position} onClick={onClick}>
      {Object.entries(nodes).map(([name, node]) => {
        if (node instanceof Mesh) {
          const mesh = node as Mesh;
          return (
            <mesh
              key={name}
              geometry={mesh.geometry}
              material={materials[Array.isArray(mesh.material) ? mesh.material[0].name : mesh.material.name]}
            >
              <Edges visible={componentId === editorValuesSnap.selectedComponentId} scale={1.05}>
                <meshBasicMaterial transparent={true} color={appConfig.spacialUi.selectionColors.outline} depthTest={false} />
              </Edges>
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
};
