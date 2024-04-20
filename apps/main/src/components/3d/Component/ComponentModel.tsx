import { Render } from "@3dwebprodconf/shared/src/components/3d/Render.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { Edges, useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { Color, Euler, MeshStandardMaterial } from "three";
import { useSnapshot } from "valtio";

import { globalConfig } from "../../../configurations/Config.ts";
import { useComponent } from "../../../hooks/useComponent.ts";
import { ConfiguratorValuesStore } from "../../../stores/ConfiguratorValuesStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";

interface ComponentModelProps {
  componentId: string;
}

const ComponentModel = ({ componentId }: ComponentModelProps) => {
  const userCreationSnap = useSnapshot(UserCreationStore);
  const configuratorValuesSnap = useSnapshot(ConfiguratorValuesStore);

  const { componentSpec } = useComponent(componentId);

  const isDarkMode = useDarkMode();

  const { scene, materials } = useGLTF(componentSpec.modelUrl);

  const customMaterials = Object.entries(
    userCreationSnap.value.components[componentId].materials
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

  const onSelect = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    if (ConfiguratorValuesStore.selectedComponentId === componentId) {
      ConfiguratorValuesStore.selectedComponentId = undefined;
      return;
    }

    ConfiguratorValuesStore.selectedComponentId = componentId;
  };

  return (
    <group
      onClick={onSelect}
      position={componentSpec.positionOffset}
      rotation={
        componentSpec.rotationOffset
          ? new Euler(...componentSpec.rotationOffset)
          : undefined
      }
      scale={componentSpec.scaleOffset}
    >
      <Render
        object={scene}
        materialOverrides={customMaterials}
        userData={{
          componentId: componentId,
          ignoreCollisions: componentSpec.ignoreCollisions,
        }}
      >
        <Edges
          visible={componentId === configuratorValuesSnap.selectedComponentId}
          scale={1}
          color={
            isDarkMode
              ? globalConfig.config.spatialUi.selectionColors.outline.dark
              : globalConfig.config.spatialUi.selectionColors.outline.light
          }
          linewidth={5}
        />
      </Render>
    </group>
  );
};

export default ComponentModel;
