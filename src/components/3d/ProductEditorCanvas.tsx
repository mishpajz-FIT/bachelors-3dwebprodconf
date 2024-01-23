import {
  AdaptiveDpr,
  Bounds,
  ContactShadows,
  Environment,
  OrbitControls,
  Preload,
  Stats,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

import { BoundsStorer } from "./BoundsStorer.tsx";
import { Component } from "./Component.tsx";
import { globalConfig } from "../../configurations/Config.ts";
import { ProductSpecificationStore } from "../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../stores/UserCreationStore.ts";

const ProductEditorCanvas = () => {
  const userCreationSnap = useSnapshot(UserCreationStore);

  useEffect(() => {
    Object.values(ProductSpecificationStore.componentSpecs).forEach(
      (componentSpec) => {
        useGLTF.preload(componentSpec.modelUrl);
      }
    );
  }, []);

  return (
    <Canvas
      className="grow touch-none bg-[#fefefe] dark:bg-[#141414]"
      frameloop="demand"
      performance={{ min: 0.85 }}
      shadows={true}
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
        <BoundsStorer key={userCreationSnap.base}>
          <Component componentId={userCreationSnap.base} />
        </BoundsStorer>
      </Bounds>
      {globalConfig.config.shadows.floorShadow && (
        <ContactShadows
          position={[0, -0.5, 0]}
          scale={10}
          blur={1.5}
          far={1}
          opacity={0.4}
        />
      )}
      <Preload all />
      <Stats />
    </Canvas>
  );
};

export default ProductEditorCanvas;
