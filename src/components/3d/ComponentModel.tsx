import {Edges, useGLTF} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber";
import {Mesh} from "three";
import {useSnapshot} from "valtio";

import {appConfig} from "../../configurations/AppConfig.ts";
import {EditorValuesStore} from "../../stores/EditorValuesStore.ts";
import {ProductSpecificationStore} from "../../stores/ProductSpecificationStore.ts";
import {UserProductStore} from "../../stores/UserProductStore.ts";

interface ComponentModelProps {
  componentId: string;
  position: [number, number, number];
}
export const ComponentModel = ({ componentId, position }: ComponentModelProps) => {
  const userProductSnap = useSnapshot(UserProductStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const componentSpecId = userProductSnap.components[componentId].componentSpec;
  const componentSpec = productSpecsSnap.componentSpecs.get(componentSpecId);

  if (!componentSpec) {
    throw `Component spec ${componentSpecId} could not be found.`;
  }

  const { nodes, materials } = useGLTF(componentSpec.modelUrl);

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    console.log("select " + componentId);

    if (EditorValuesStore.selectedComponentId === componentId) {
      EditorValuesStore.selectedComponentId = undefined;
      return;
    }

    EditorValuesStore.selectedComponentId = componentId;
  };

  return (
    <group position={position} onClick={select}>
      {Object.entries(nodes).map(([name, node]) => {
        if (node.type === "Mesh") {
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
