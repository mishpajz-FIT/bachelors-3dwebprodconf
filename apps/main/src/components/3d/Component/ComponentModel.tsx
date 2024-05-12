import { Render } from "@3dwebprodconf/shared/src/components/3d/Render.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { Outlines, useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box3, Color, Euler, Group, Material, Matrix4, Vector3 } from "three";
import { useSnapshot } from "valtio";

import { SelectionButton } from "./SelectionButton.tsx";
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

  const [centerPosition, setCenterPosition] = useState<Vector3 | undefined>(
    undefined
  );

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

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.updateMatrixWorld(true);
    const boundingBox = new Box3().setFromObject(groupRef.current);
    const center = new Vector3();
    boundingBox.getCenter(center);
    const inverseMatrix = new Matrix4()
      .copy(groupRef.current.matrixWorld)
      .invert();
    setCenterPosition(center.applyMatrix4(inverseMatrix));
  }, []);

  return (
    <>
      <group ref={groupRef}>
        {centerPosition && (
          <SelectionButton
            componentId={componentId}
            position={centerPosition}
          />
        )}
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
              visible={
                componentId === configuratorValuesSnap.selectedComponentId
              }
            />
          </Render>
        </group>
      </group>
    </>
  );
};

export default ComponentModel;
