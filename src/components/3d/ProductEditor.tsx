import {
  AdaptiveDpr, AdaptiveEvents,
  Bounds,
  ContactShadows,
  Environment,
  OrbitControls, PerformanceMonitor,
  Preload, Stats
} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {useState} from "react";
import {useSnapshot} from "valtio";

import {Component} from "./Component.tsx";
import {appConfig} from "../../configurations/AppConfig.ts";
import {EditorValuesStore} from "../../stores/EditorValuesStore.ts";
import {ProductSpecificationStore} from "../../stores/ProductSpecificationStore.ts";
import {
  UserProductStore
} from "../../stores/UserProductStore.ts";
import {Side} from "../2d/containers/Side.tsx";
import {EditComponent} from "../2d/EditComponent.tsx";
import { SelectBase } from "../2d/SelectBase.tsx";

export const ProductEditor = () => {
  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const userProductSnap = useSnapshot(UserProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  const [isBaseSelectionOpen, setBaseSelectionOpen] = useState(false);

  if (!productSpecsSnap) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product!");
  }

  return (
    <div className="relative flex grow flex-col">
      <Canvas
        className="grow"
        frameloop="demand"
        performance={{ min: 0.85 }}
        shadows={true}
        style={{ touchAction: "none", background: "#fefefe" }}
        orthographic={appConfig.camera.isOrthogonal}
        camera={{ position: [0, 1.7, 3]}}>
        <OrbitControls makeDefault={true} regress={true} />
        <Environment preset="city" />
        <AdaptiveDpr />
        <ambientLight intensity={0.3} />
        <hemisphereLight
          color={"#ffffff"}
          groundColor={"#bbbbbb"}
          intensity={0.5} />
        <directionalLight
          position={[2, 2, 5]}
          intensity={0.7}
        />
        <Bounds fit clip observe margin={2}>
          <Component
            key={userProductSnap.base}
            componentId={userProductSnap.base}
          />

        </Bounds>
        {appConfig.shadows.floorShadow ?
          <ContactShadows
            position={[0, -0.5, 0]}
            scale={10}
            blur={1.5}
            far={1}
            opacity={0.4}/> :
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[15, 15]} />
            <meshPhysicalMaterial color={0xfefefe} />
          </mesh>}
        <Preload all />
        <Stats />
      </Canvas>
      <Side isOpen={editorValuesSnap.selectedComponentId !== undefined}>
        <EditComponent onClose={() => EditorValuesStore.selectedComponentId = undefined} />
      </Side>

      <div className="bg-white p-2 shadow-md dark:bg-gray-900">
        <button
          className="other-button"
          onClick={() => setBaseSelectionOpen(true)}>
          Back
        </button>
      </div>

      {isBaseSelectionOpen && (
        <div className="absolute inset-0 z-[75] bg-white dark:bg-gray-900">
          <SelectBase onClose={() => setBaseSelectionOpen(false)}/>
        </div>
      )}
    </div>
  );
};
