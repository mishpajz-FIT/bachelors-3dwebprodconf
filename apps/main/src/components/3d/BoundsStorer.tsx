import { useBounds } from "@react-three/drei";
import { ReactNode, useEffect } from "react";

import { EditorValuesStore } from "../../stores/EditorValuesStore.ts";
import { refreshBounds } from "../../utilities/BoundsManimpuation.ts";

interface BoundsStorerProps {
  children: ReactNode;
}
export const BoundsStorer = ({ children }: BoundsStorerProps) => {
  const bounds = useBounds();

  useEffect(() => {
    EditorValuesStore.bounds = bounds;

    refreshBounds(() => undefined);

    return () => {
      EditorValuesStore.bounds = undefined;
    };
  }, [bounds]);

  return children;
};
