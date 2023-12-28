import {
  AdaptiveDpr,
  Bounds,
  ContactShadows,
  Environment,
  OrbitControls,
  Preload,
  Stage,
  Stats
} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {useSnapshot} from "valtio";

import {ProductComponent} from "./ProductComponent.tsx";
import {appConfig} from "../configurations/AppConfig.ts";
import {ProductOptionsStore} from "../stores/ProductOptionsStore.ts";
import {
  UserProductStore
} from "../stores/UserProductStore.ts";

export const ProductEditor = () => {
  const productOptionsSnap = useSnapshot(ProductOptionsStore);
  const userProductSnap = useSnapshot(UserProductStore);

  if (!productOptionsSnap) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product");
  }

  return (
    <Canvas
      shadows={true}
      style={{ touchAction: "none", background: "#fefefe" }}
      orthographic={appConfig.camera.isOrthogonal}
      camera={{ position: [0, 1.7, 3]}}>
      <AdaptiveDpr pixelated />
      <OrbitControls makeDefault={true} />
      <Environment preset="studio" />
      <ambientLight intensity={0.3} />
      <hemisphereLight
        skyColor={"#ffffff"}
        groundColor={"#bbbbbb"}
        intensity={0.5} />
      <directionalLight
        castShadow={true}
        position={[2, 2, 5]} // Adjust position for better shadow casting
        intensity={0.7} // Adjust intensity
      />
      <Bounds fit clip observe>
        <ProductComponent
          key={userProductSnap.baseComponentId}
          userComponentId={userProductSnap.baseComponentId}
        />
      </Bounds>
      <Preload all />
      <Stats />
    </Canvas>
  );
};
