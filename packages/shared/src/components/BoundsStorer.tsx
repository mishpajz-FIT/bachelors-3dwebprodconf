import { useBounds } from "@react-three/drei";
import { ReactNode, useEffect } from "react";

import { BoundsStorage } from "../interfaces/BoundsStorage.ts";

interface BoundsStorerProps {
  boundsStorage: BoundsStorage;
  refresh: () => void;
  children: ReactNode;
}

export const BoundsStorer = ({
  boundsStorage,
  refresh,
  children,
}: BoundsStorerProps) => {
  const bounds = useBounds();

  useEffect(() => {
    boundsStorage.bounds = bounds;

    refresh();

    return () => {
      boundsStorage.bounds = undefined;
    };
  }, [bounds, boundsStorage, refresh]);

  return children;
};
