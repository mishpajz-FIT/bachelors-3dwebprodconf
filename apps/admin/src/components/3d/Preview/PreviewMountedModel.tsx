import { Render } from "@3dwebprodconf/shared/src/components/3d/Render.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { useGLTF } from "@react-three/drei";
import { Euler } from "three";
import { useSnapshot } from "valtio";

import { defaultAdminConfig } from "../../../configurations/Config.ts";
import { EditorValuesStore } from "../../../stores/EditorValuesStore.ts";
import { ProductStore } from "../../../stores/ProductStore.ts";

export const PreviewMountedModel = () => {
  const productSnap = useSnapshot(ProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const darkMode = useDarkMode();

  if (!editorValuesSnap.previewedMountedComponent) {
    throw Error(`No previewed mounted component`);
  }

  const previewedMountedComponent =
    productSnap.componentSpecs[editorValuesSnap.previewedMountedComponent];
  if (!previewedMountedComponent) {
    throw Error(
      `Missing component ${editorValuesSnap.previewedMountedComponent}`
    );
  }

  const { scene } = useGLTF(previewedMountedComponent.modelUrl);

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
      <Render object={scene}>
        <meshBasicMaterial
          opacity={0.5}
          transparent
          color={
            darkMode
              ? defaultAdminConfig.spatialUi.gridColors.primary.dark
              : defaultAdminConfig.spatialUi.gridColors.primary.light
          }
        />
      </Render>
    </group>
  );
};
