import { useBounds } from "@react-three/drei";
import { ReactNode, useEffect } from "react";

import { EditorValuesStore } from "../../stores/EditorValuesStore.ts";

interface BoundsStorerProps {
  children: ReactNode;
}
export const BoundsStorer = ({ children }: BoundsStorerProps) => {
  const bounds = useBounds();

  useEffect(() => {
    EditorValuesStore.bounds = bounds;

    return () => {
      EditorValuesStore.bounds = undefined;
    };
  }, [bounds]);

  return children;
};
