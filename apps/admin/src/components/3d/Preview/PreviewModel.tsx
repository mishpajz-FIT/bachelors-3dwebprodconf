import { PlacementControls } from "@3dwebprodconf/shared/src/components/3d/PlacementControls.tsx";
import { Render } from "@3dwebprodconf/shared/src/components/3d/Render.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Box3, Euler, Material, MeshBasicMaterial, Vector3 } from "three";
import { useSnapshot } from "valtio";

import { PreviewMountingPoint } from "./PreviewMountingPoint.tsx";
import { defaultAdminConfig } from "../../../configurations/Config.ts";
import { useSelectedComponentSpec } from "../../../hooks/useSelectedComponentSpec.ts";
import {
  EditorValuesNonReactiveStore,
  EditorValuesStore,
} from "../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../stores/ProductStore.ts";

export const PreviewModel = () => {
  const { componentSpecId, componentSpec } = useSelectedComponentSpec();
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const { scene } = useGLTF(componentSpec.modelUrl);

  const groupRef = useRef(null);

  const darkMode = useDarkMode();
  const rgbColors: [string, string, string] = darkMode
    ? [
        defaultAdminConfig.spatialUi.gizmoColors.r.dark,
        defaultAdminConfig.spatialUi.gizmoColors.g.dark,
        defaultAdminConfig.spatialUi.gizmoColors.b.dark,
      ]
    : [
        defaultAdminConfig.spatialUi.gizmoColors.r.light,
        defaultAdminConfig.spatialUi.gizmoColors.g.light,
        defaultAdminConfig.spatialUi.gizmoColors.b.light,
      ];

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

  useEffect(() => {
    if (groupRef.current) {
      EditorValuesNonReactiveStore.currentGroup = groupRef.current;
    }

    return () => {
      EditorValuesNonReactiveStore.currentGroup = undefined;
    };
  }, [groupRef]);

  const materialOverrides = useMemo(() => {
    // eslint-disable-next-line valtio/state-snapshot-rule
    if (!editorValuesSnap.selectedMaterial) {
      return undefined;
    }

    const newMaterial = new MeshBasicMaterial({
      color: darkMode
        ? defaultAdminConfig.spatialUi.gridColors.primary.dark
        : defaultAdminConfig.spatialUi.gridColors.primary.light,
    });

    return componentSpec.materialSpecs[
      // eslint-disable-next-line valtio/state-snapshot-rule
      editorValuesSnap.selectedMaterial
    ].modelMaterials.reduce(
      (acc, cur) => {
        acc[cur] = newMaterial;
        return acc;
      },
      {} as Record<string, Material>
    );
  }, [
    componentSpec.materialSpecs,
    darkMode,
    editorValuesSnap.selectedMaterial,
  ]);

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
          const editableComponent =
            ProductStore.componentSpecs[componentSpecId];

          editableComponent.positionOffset = position;
        }}
        updateRotation={(rotation) => {
          const editableComponent =
            ProductStore.componentSpecs[componentSpecId];

          editableComponent.rotationOffset = rotation;
        }}
        onManipulationEnd={() => undefined}
        axisColors={rgbColors}
        hidden={editorValuesSnap.selectedMountingPoint !== undefined}
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
          <Render object={scene} materialOverrides={materialOverrides} />
        </group>
      </PlacementControls>
      {Object.keys(componentSpec.mountingPointsSpecs).map((mountingPointId) => {
        return (
          <group key={mountingPointId}>
            <PreviewMountingPoint mountingPointId={mountingPointId} />
          </group>
        );
      })}
    </>
  );
};
