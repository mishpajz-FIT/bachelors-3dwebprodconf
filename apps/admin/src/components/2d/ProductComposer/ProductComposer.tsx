import { BoundsStorer } from "@3dwebprodconf/shared/src/components/BoundsStorer.tsx";
import { Side } from "@3dwebprodconf/shared/src/components/containers/Side.tsx";
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
import { useSnapshot } from "valtio";

import { EditComponentSpecification } from "./Edit/EditComponentSpecification/EditComponentSpecification.tsx";
import { ProductComposerTabs } from "./Tabs/ProductComposerTabs.tsx";
import { EditorValuesStore } from "../../../stores/EditorValuesStore.ts";
import { refreshBounds } from "../../../utilities/BoundsManipulation.ts";
import { PreviewModel } from "../../3d/PreviewModel.tsx";

export const ProductComposer = () => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  return (
    <>
      <ProductComposerTabs />
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
          fadeDistance={10}
          fadeStrength={1}
          infiniteGrid={true}
          cellSize={0.1}
          sectionSize={1}
          cellThickness={0.5}
          sectionThickness={1}
          cellColor={"#6f6f6f"}
          sectionColor={"#3377ff"}
        />
        <Bounds fit clip observe margin={2}>
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
              material-color={"#3377ff"}
            />
            {editorValuesSnap.selectedComponentSpec && <PreviewModel />}
          </BoundsStorer>
        </Bounds>
        <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
          <GizmoViewport
            axisColors={["#DC143C", "#00FF7F", "#1E90FF"]}
            labelColor="white"
          />
        </GizmoHelper>
        <Preload all />
      </Canvas>

      <Side
        isOpen={editorValuesSnap.selectedComponentSpec !== undefined}
        larger={true}
      >
        <EditComponentSpecification
          onClose={() => {
            EditorValuesStore.selectedComponentSpec = undefined;
            EditorValuesStore.selectedMountingPoint = undefined;
            EditorValuesStore.selectedMaterial = undefined;
          }}
        />
      </Side>
    </>
  );
};
