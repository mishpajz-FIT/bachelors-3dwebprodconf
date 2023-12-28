import {AdaptiveDpr, Bounds, OrbitControls, Preload, Stage} from "@react-three/drei";
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
      style={{ touchAction: "none", background: "#fefefe" }}
      orthographic={appConfig.camera.isOrthogonal}
      camera={{ position: [0, 1.7, 3]}}>
      <AdaptiveDpr pixelated />
      <OrbitControls makeDefault={true} />
      <Stage
        preset="rembrandt"
        environment="studio"
        intensity={0.2}
        adjustCamera
      >
        <Bounds fit clip observe>
          <ProductComponent
            key={userProductSnap.baseComponentId}
            userComponentId={userProductSnap.baseComponentId}
          />
        </Bounds>
      </Stage>

      <Preload all />
    </Canvas>
  );
};
