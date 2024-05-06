import { Render } from "@3dwebprodconf/shared/src/components/3d/Render.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { Outlines, useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, Euler, Group, Material } from "three";
import { useSnapshot } from "valtio";

import { globalConfig } from "../../../configurations/Config.ts";
import { useComponent } from "../../../hooks/useComponent.ts";
import {
  ConfiguratorValuesNonReactiveStore,
  ConfiguratorValuesStore,
} from "../../../stores/ConfiguratorValuesStore.ts";

interface ComponentModelProps {
  componentId: string;
}

const ComponentModel = ({ componentId }: ComponentModelProps) => {
  const configuratorValuesSnap = useSnapshot(ConfiguratorValuesStore);

  const { component, componentSpec } = useComponent(componentId);

  const isDarkMode = useDarkMode();

  const { scene, materials } = useGLTF(componentSpec.modelUrl);
  const groupRef = useRef<Group>(null);

  const customMaterials = useMemo(
    () =>
      Object.entries(component.materials).reduce<Record<string, Material>>(
        (acc, [materialSpecId, colorSpecId]) => {
          const materialSpec = componentSpec.materialSpecs[materialSpecId];
          if (!materialSpec) return acc;

          const colorSpec = materialSpec.colorVariationsSpecs[colorSpecId];
          if (!colorSpec) return acc;

          materialSpec.modelMaterials.forEach((modelMaterialName) => {
            const originalMaterial = materials[modelMaterialName];
            if ("color" in originalMaterial) {
              const newMaterial = originalMaterial.clone();
              newMaterial.color = new Color(colorSpec.value);
              acc[modelMaterialName] = newMaterial;
            }
          });

          return acc;
        },
        {}
      ),
    [componentSpec.materialSpecs, materials, component.materials]
  );

  useEffect(() => {
    if (configuratorValuesSnap.selectedComponentId === componentId) {
      if (groupRef.current) {
        ConfiguratorValuesNonReactiveStore.currentGroup = groupRef.current;
      }
    }
  }, [configuratorValuesSnap.selectedComponentId, componentId]);

  const onSelect = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    if (ConfiguratorValuesStore.selectedComponentId === componentId) {
      ConfiguratorValuesStore.selectedComponentId = undefined;
      return;
    }

    ConfiguratorValuesStore.selectedComponentId = componentId;
  };

  return (
    <group ref={groupRef}>
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
          dontMatrixAutoUpdate={true}
        >
          <Outlines
            thickness={4}
            screenspace={true}
            color={
              isDarkMode
                ? globalConfig.config.spatialUi.selectionColors.outline.dark
                : globalConfig.config.spatialUi.selectionColors.outline.light
            }
            visible={componentId === configuratorValuesSnap.selectedComponentId}
          />
        </Render>
      </group>
    </group>
  );
};

export default ComponentModel;
