import { Edges, useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Color, Mesh, MeshStandardMaterial } from "three";
import { useSnapshot } from "valtio";

import { globalConfig } from "../../../configurations/Config.ts";
import { ConfiguratorValuesStore } from "../../../stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";

interface ComponentModelProps {
  componentId: string;
  position: [number, number, number];
}
const ComponentModel = ({ componentId, position }: ComponentModelProps) => {
  const userCreationSnap = useSnapshot(UserCreationStore);
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const configuratorValuesSnap = useSnapshot(ConfiguratorValuesStore);

  const componentSpecId =
    userCreationSnap.components[componentId].componentSpec;
  const componentSpec = productSpecsSnap.componentSpecs[componentSpecId];
  if (!componentSpec) {
    throw `Component spec ${componentSpecId} could not be found.`;
  }

  const [outlineColor, setOutlineColor] = useState(
    globalConfig.config.spatialUi.selectionColors.outline.light
  );
  useEffect(() => {
    const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const themeSwitcher = (dark: boolean) => {
      if (dark) {
        setOutlineColor(
          globalConfig.config.spatialUi.selectionColors.outline.dark
        );
      } else {
        setOutlineColor(
          globalConfig.config.spatialUi.selectionColors.outline.light
        );
      }
    };

    const themeListener = (e: MediaQueryListEvent) => {
      themeSwitcher(e.matches);
    };
    themeSwitcher(darkThemeQuery.matches);
    darkThemeQuery.addEventListener("change", themeListener);
    return () => darkThemeQuery.removeEventListener("change", themeListener);
  }, []);

  const { nodes, materials } = useGLTF(componentSpec.modelUrl);

  const customMaterials = Object.entries(
    userCreationSnap.components[componentId].materials
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

    if (ConfiguratorValuesStore.selectedComponentId === componentId) {
      ConfiguratorValuesStore.selectedComponentId = undefined;
      return;
    }

    ConfiguratorValuesStore.selectedComponentId = componentId;
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
                visible={
                  componentId === configuratorValuesSnap.selectedComponentId
                }
                scale={1.05}
              >
                <meshBasicMaterial
                  transparent={true}
                  color={outlineColor}
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

export default ComponentModel;
