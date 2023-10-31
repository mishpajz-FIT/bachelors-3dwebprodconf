import {AdaptiveDpr, Bounds, Preload, PresentationControls, Stage} from "@react-three/drei";
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
    <Canvas style={{ touchAction: 'none' }} orthographic={appConfig.camera.isOrthogonal}>
      <AdaptiveDpr pixelated />
      <color attach="background" args={["#fefefe"]} />
      <PresentationControls
        speed={1.5}
        global
        zoom={0.7}
        polar={[-0.1, Math.PI / 4]}
      >
        <Stage
          preset="soft"
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
      </PresentationControls>
      <Preload all />
    </Canvas>
  );
};
