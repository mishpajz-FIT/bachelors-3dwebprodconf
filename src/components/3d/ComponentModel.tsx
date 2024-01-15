import { Edges, useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useContext } from "react";
import { Color, Mesh, MeshStandardMaterial } from "three";
import { useSnapshot } from "valtio";

import { ConfigContext } from "../../configurations/contexts/ConfigContext.ts";
import { EditorValuesStore } from "../../stores/EditorValuesStore.ts";
import { ProductSpecificationStore } from "../../stores/ProductSpecificationStore.ts";
import { UserProductStore } from "../../stores/UserProductStore.ts";

interface ComponentModelProps {
  componentId: string;
  position: [number, number, number];
}
export const ComponentModel = ({
  componentId,
  position,
}: ComponentModelProps) => {
  const userProductSnap = useSnapshot(UserProductStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const appConfig = useContext(ConfigContext);

  const componentSpecId = userProductSnap.components[componentId].componentSpec;
  const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];

  if (!componentSpec) {
    throw `Component spec ${componentSpecId} could not be found.`;
  }

  const { nodes, materials } = useGLTF(componentSpec.modelUrl);

  const customMaterials = Object.entries(
    userProductSnap.components[componentId].materials
  ).reduce<Record<string, MeshStandardMaterial>>(
    (acc, [materialSpecId, colorSpecId]) => {
      const materialSpec = componentSpec.materialSpecs[materialSpecId];
      if (!materialSpec) return acc;

      const colorSpec = materialSpec.colorVariationsSpecs[colorSpecId];
      if (!colorSpec) return acc;

      materialSpec.modelMaterials.forEach((modelMaterialName) => {
        const originalMaterial = materials[modelMaterialName];
        if (originalMaterial instanceof MeshStandardMaterial) {
          acc[modelMaterialName] = originalMaterial.clone();
          acc[modelMaterialName].color = new Color(colorSpec.value);
        }
      });

      return acc;
    },
    {}
  );

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

          const materialName = Array.isArray(mesh.material)
            ? mesh.material[0].name
            : mesh.material.name;
          const material =
            customMaterials[materialName] || materials[materialName];

          return (
            <mesh key={name} geometry={mesh.geometry} material={material}>
              <Edges
                visible={componentId === editorValuesSnap.selectedComponentId}
                scale={1.05}
              >
                <meshBasicMaterial
                  transparent={true}
                  color={appConfig.spatialUi.selectionColors.outline}
                  depthTest={false}
                />
              </Edges>
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
};
