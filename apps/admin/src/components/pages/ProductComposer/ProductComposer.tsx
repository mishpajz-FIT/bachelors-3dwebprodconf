import { CanvasLoading } from "@3dwebprodconf/shared/src/components/CanvasLoading.tsx";
import { Side } from "@3dwebprodconf/shared/src/components/containers/Side.tsx";
import { Suspense } from "react";
import { useSnapshot } from "valtio";

import { ProductComposerTabs } from "./Tabs/ProductComposerTabs.tsx";
import { EditorValuesStore } from "../../../stores/EditorValuesStore.ts";
import { ProductComposerCanvas } from "../../3d/ProductComposerCanvas.tsx";
import { EditComponentSpecification } from "../../panels/Edit/EditComponentSpecification/EditComponentSpecification.tsx";

const ProductComposer = () => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  return (
    <div className="relative flex min-h-0 shrink grow flex-row">
      <ProductComposerTabs />

      <div className="relative flex shrink grow overflow-hidden">
        <Suspense
          fallback={
            <div className="other-background size-full">
              <CanvasLoading />
            </div>
          }
        >
          <ProductComposerCanvas />
        </Suspense>

        <Side
          isOpen={editorValuesSnap.selectedComponentSpec !== undefined}
          larger={true}
        >
          <EditComponentSpecification
            onClose={() => {
              EditorValuesStore.selectedComponentSpec = undefined;
              EditorValuesStore.selectedMountingPoint = undefined;
              EditorValuesStore.selectedMaterial = undefined;
              EditorValuesStore.previewedMountedComponent = undefined;
            }}
          />
        </Side>
      </div>
    </div>
  );
};

export default ProductComposer;
