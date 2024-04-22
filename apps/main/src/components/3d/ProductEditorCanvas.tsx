import { BoundsStorer } from "@3dwebprodconf/shared/src/components/BoundsStorer.tsx";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  EyeIcon,
  EyeSlashIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import {
  AdaptiveDpr,
  Bounds,
  ContactShadows,
  Environment,
  OrbitControls,
  Preload,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { MOUSE } from "three";
import { useSnapshot } from "valtio";

import { Component } from "./Component/Component.tsx";
import { SceneStorer } from "./SceneStorer.tsx";
import { globalConfig } from "../../configurations/Config.ts";
import {
  ConfiguratorValuesNonReactiveStore,
  ConfiguratorValuesStore,
} from "../../stores/ConfiguratorValuesStore.ts";
import { ProductSpecificationStore } from "../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../stores/UserCreationStore.ts";
import { refreshBounds } from "../../utilities/BoundsManipulation.ts";
import { canvasChangedEvent, emitter } from "../../utilities/Emitters.ts";

const ProductEditorCanvas = () => {
  const userCreationSnap = useSnapshot(UserCreationStore);
  const configuratorValuesSnap = useSnapshot(ConfiguratorValuesStore);

  useEffect(() => {
    Object.values(ProductSpecificationStore.componentSpecs).forEach(
      (componentSpec) => {
        useGLTF.preload(componentSpec.modelUrl);
      }
    );
  }, []);

  return (
    <>
      <Canvas
        className="shrink grow touch-none bg-[#fefefe] dark:bg-[#141414]"
        frameloop="demand"
        performance={{ min: 0.85 }}
        shadows={true}
        orthographic={globalConfig.config.camera.isOrthogonal}
        camera={{ position: [0, 1.7, 3] }}
        onPointerMissed={() => {
          ConfiguratorValuesStore.selectedComponentId = undefined;
        }}
      >
        <SceneStorer />
        <OrbitControls
          makeDefault={true}
          regress={true}
          mouseButtons={
            globalConfig.config.spatialUi.controls.swapMouseButtons
              ? {
                  LEFT: MOUSE.PAN,
                  MIDDLE: MOUSE.DOLLY,
                  RIGHT: MOUSE.ROTATE,
                }
              : undefined
          }
        />
        <Environment preset="city" />
        <AdaptiveDpr />
        <ambientLight intensity={0.3} />
        <hemisphereLight
          color={"#ffffff"}
          groundColor={"#bbbbbb"}
          intensity={0.5}
        />
        <directionalLight position={[2, 2, 5]} intensity={0.7} />
        <Bounds fit clip observe margin={1.2}>
          <BoundsStorer
            key={userCreationSnap.value.base}
            boundsStorage={ConfiguratorValuesNonReactiveStore}
            refresh={() => refreshBounds(() => undefined)}
          >
            <Component componentId={userCreationSnap.value.base} />
          </BoundsStorer>
        </Bounds>
        {globalConfig.config.shadows.floorShadow && (
          <ContactShadows
            position={[0, 0, 0]}
            scale={10}
            blur={1.5}
            far={1}
            opacity={0.4}
          />
        )}
        <Preload all />
      </Canvas>
      <div className="absolute left-4 top-6">
        <div className="glass-panel flex flex-col items-center justify-center divide-y divide-gray-200 rounded dark:divide-zinc-700">
          <button
            className="p-3 transition duration-150 ease-in-out active:scale-95 sm:p-2"
            onClick={() => refreshBounds(() => undefined)}
          >
            <VideoCameraIcon className="size-4 stroke-2 hover:stroke-1" />
          </button>
          <button
            className="p-3 transition duration-150 ease-in-out active:scale-95 sm:p-2"
            onClick={() =>
              (ConfiguratorValuesStore.showMountingPoints =
                !ConfiguratorValuesStore.showMountingPoints)
            }
          >
            {configuratorValuesSnap.showMountingPoints ? (
              <EyeSlashIcon className="size-4 stroke-2 hover:stroke-1" />
            ) : (
              <EyeIcon className="size-4 stroke-2 hover:stroke-1" />
            )}
          </button>
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="glass-panel flex items-center justify-center divide-x divide-gray-200 rounded-md dark:divide-zinc-700">
          <button
            onClick={() => {
              userCreationSnap.undo();
              emitter.emit(canvasChangedEvent);
            }}
            className={`p-3 sm:p-2 ${userCreationSnap.isUndoEnabled && "transition duration-150 ease-in-out active:scale-95"}`}
            disabled={!userCreationSnap.isUndoEnabled}
          >
            <ArrowUturnLeftIcon
              className={`size-4 stroke-2 ${userCreationSnap.isUndoEnabled ? "hover:stroke-1" : "stroke-gray-400 dark:stroke-gray-500"}`}
            />
          </button>
          <button
            onClick={() => {
              userCreationSnap.redo();
              emitter.emit(canvasChangedEvent);
            }}
            className={`p-3 sm:p-2 ${userCreationSnap.isRedoEnabled && "transition duration-150 ease-in-out active:scale-95"}`}
            disabled={!userCreationSnap.isRedoEnabled}
          >
            <ArrowUturnRightIcon
              className={`size-4 stroke-2 ${userCreationSnap.isRedoEnabled ? "hover:stroke-1" : "stroke-gray-400 dark:stroke-gray-500"}`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductEditorCanvas;
