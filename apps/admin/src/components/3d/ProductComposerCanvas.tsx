import { BoundsStorer } from "@3dwebprodconf/shared/src/components/BoundsStorer.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import {
  AdaptiveDpr,
  Bounds,
  Box,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  Preload,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { DoubleSide } from "three";
import { useSnapshot } from "valtio";

import { PreviewModel } from "./Preview/PreviewModel.tsx";
import { defaultAdminConfig } from "../../configurations/Config.ts";
import { EditorValuesStore } from "../../stores/EditorValuesStore.ts";
import { refreshBounds } from "../../utilities/BoundsManipulation.ts";
import { ErrorBoundary } from "react-error-boundary";
import toast from "react-hot-toast";

export const ProductComposerCanvas = () => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);

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

  return (
    <>
      <Canvas
        className="grow touch-none bg-[#fefefe] dark:bg-[#141414]"
        frameloop="demand"
        performance={{ min: 0.85 }}
        shadows={true}
        camera={{ position: [0, 1.7, 3] }}
      >
        <OrbitControls makeDefault={true} regress={true} />
        <Environment preset="city" />
        <AdaptiveDpr />
        <ambientLight intensity={0.3} />
        <hemisphereLight
          color={"#ffffff"}
          groundColor={"#bbbbbb"}
          intensity={0.5}
        />
        <directionalLight position={[2, 2, 5]} intensity={0.7} />
        <Grid
          position={[0, 0, 0]}
          args={[10, 10]}
          fadeDistance={30}
          fadeStrength={2}
          infiniteGrid={true}
          cellSize={0.1}
          sectionSize={1}
          cellThickness={0.5}
          sectionThickness={1}
          side={DoubleSide}
          cellColor={
            darkMode
              ? defaultAdminConfig.spatialUi.gridColors.secondary.dark
              : defaultAdminConfig.spatialUi.gridColors.secondary.light
          }
          sectionColor={
            darkMode
              ? defaultAdminConfig.spatialUi.gridColors.primary.dark
              : defaultAdminConfig.spatialUi.gridColors.primary.light
          }
        />
        <Bounds fit clip observe margin={4}>
          <BoundsStorer
            key={editorValuesSnap.selectedComponentSpec}
            boundsStorage={EditorValuesStore}
            refresh={() => {
              refreshBounds();
            }}
          >
            <Box
              args={[0.1, 0.1, 0.1]}
              position={[0, 0, 0]}
              material-color={
                darkMode
                  ? defaultAdminConfig.spatialUi.gridColors.primary.dark
                  : defaultAdminConfig.spatialUi.gridColors.primary.light
              }
            />

            <ErrorBoundary
              fallbackRender={() => null}
              onError={() => {
                toast.error("Model of component could not be loaded.", {
                  style: {
                    color: "white",
                    background: darkMode
                      ? defaultAdminConfig.ui.colors.error.dark
                      : defaultAdminConfig.ui.colors.error.light,
                  },
                  iconTheme: {
                    secondary: darkMode
                      ? defaultAdminConfig.ui.colors.error.dark
                      : defaultAdminConfig.ui.colors.error.light,
                    primary: "white",
                  },
                });
              }}
            >
              {editorValuesSnap.selectedComponentSpec && <PreviewModel />}
            </ErrorBoundary>
          </BoundsStorer>
        </Bounds>
        <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
          <GizmoViewport axisColors={rgbColors} labelColor="white" />
        </GizmoHelper>
        <Preload all />
      </Canvas>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="glass-panel flex flex-row items-center justify-center rounded p-2">
          <button
            className="transition duration-150 ease-in-out active:scale-95"
            onClick={() => refreshBounds()}
          >
            <VideoCameraIcon className="size-4 stroke-2 hover:stroke-1" />
          </button>
        </div>
      </div>
    </>
  );
};
