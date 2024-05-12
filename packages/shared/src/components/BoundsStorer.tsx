import { useBounds } from "@react-three/drei";
import { ReactNode, useEffect } from "react";

import { BoundsStorage } from "../interfaces/BoundsStorage.ts";

interface BoundsStorerProps {
  boundsStorage: BoundsStorage;
  children: ReactNode;
  refresh?: () => void;
}

export const BoundsStorer = ({
  boundsStorage,
  children,
  refresh,
}: BoundsStorerProps) => {
  const bounds = useBounds();

  useEffect(() => {
    boundsStorage.bounds = bounds;

    refresh?.();

    return () => {
      boundsStorage.bounds = undefined;
    };
  }, [boundsStorage, bounds, refresh]);

  return children;
};
