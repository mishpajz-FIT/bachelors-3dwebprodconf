import { CanvasLoading } from "@3dwebprodconf/shared/src/components/CanvasLoading.tsx";
import { Side } from "@3dwebprodconf/shared/src/components/containers/Side.tsx";
import { Suspense } from "react";
import { useSnapshot } from "valtio";

import { EditComponentSpecification } from "./Edit/EditComponentSpecification/EditComponentSpecification.tsx";
import { ProductComposerTabs } from "./Tabs/ProductComposerTabs.tsx";
import { EditorValuesStore } from "../../../stores/EditorValuesStore.ts";
import { ProductComposerCanvas } from "../../3d/ProductComposerCanvas.tsx";

export const ProductComposer = () => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  return (
    <>
      <ProductComposerTabs />

      <Suspense fallback={<CanvasLoading />}>
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
          }}
        />
      </Side>
    </>
  );
};
