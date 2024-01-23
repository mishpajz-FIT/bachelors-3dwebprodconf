import {
  AdaptiveDpr,
  Bounds,
  ContactShadows,
  Environment,
  OrbitControls,
  Preload,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useSnapshot } from "valtio";

import { BoundsStorer } from "./BoundsStorer.tsx";
import { Component } from "./Component.tsx";
import { globalConfig } from "../../configurations/Config.ts";
import { UserCreationStore } from "../../stores/UserCreationStore.ts";

export const ProductEditorCanvas = () => {
  const userProductSnap = useSnapshot(UserCreationStore);

  return (
    <Canvas
      className="grow"
      frameloop="demand"
      performance={{ min: 0.85 }}
      shadows={true}
      style={{ touchAction: "none", background: "#fefefe" }}
      orthographic={globalConfig.config.camera.isOrthogonal}
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
      <Bounds fit clip observe margin={2}>
        <BoundsStorer>
          <Component
            key={userProductSnap.base}
            componentId={userProductSnap.base}
          />
        </BoundsStorer>
      </Bounds>
      {globalConfig.config.shadows.floorShadow ? (
        <ContactShadows
          position={[0, -0.5, 0]}
          scale={10}
          blur={1.5}
          far={1}
          opacity={0.4}
        />
      ) : (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[15, 15]} />
          <meshPhysicalMaterial color={0xfefefe} />
        </mesh>
      )}
      <Preload all />
      <Stats />
    </Canvas>
  );
};
