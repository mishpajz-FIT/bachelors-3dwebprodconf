import {
  AdaptiveDpr,
  Bounds,
  ContactShadows,
  Environment,
  OrbitControls,
  Preload, Stats
} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {useSnapshot} from "valtio";

import {ProductComponent} from "./ProductComponent.tsx";
import {appConfig} from "../../configurations/AppConfig.ts";
import {ProductOptionsStore} from "../../stores/ProductOptionsStore.ts";
import {
  UserProductStore
} from "../../stores/UserProductStore.ts";
import {Side} from "../2d/containers/Side.tsx";
import {EditorValuesStore} from "../../stores/EditorValuesStore.ts";
import {ComponentSelection} from "../2d/ComponentSelection.tsx";

export const ProductEditor = () => {
  const productOptionsSnap = useSnapshot(ProductOptionsStore);
  const userProductSnap = useSnapshot(UserProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  if (!productOptionsSnap) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product");
  }

  return (
    <>
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
          color={"#ffffff"}
          groundColor={"#bbbbbb"}
          intensity={0.5} />
        <directionalLight
          position={[2, 2, 5]}
          intensity={0.7}
        />
        <Bounds fit clip observe margin={2}>
          <ProductComponent
            key={userProductSnap.baseComponentId}
            userComponentId={userProductSnap.baseComponentId}
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
            <meshPhysicalMaterial color={"white"} />
          </mesh>}
        <Preload all />
        <Stats />
      </Canvas>
      <Side isOpen={editorValuesSnap.selectedComponentId !== undefined}>
        <ComponentSelection onClose={() => EditorValuesStore.selectedComponentId = undefined} />
      </Side>
    </>
  );
};
