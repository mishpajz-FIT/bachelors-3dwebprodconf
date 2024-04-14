import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { ref as valtioRef } from "valtio";

import { ConfiguratorValuesStore } from "../../stores/ConfiguratorValuesStore.ts";

export const SceneStorer = () => {
  const { scene } = useThree();

  useEffect(() => {
    ConfiguratorValuesStore.scene = valtioRef(scene);

    return () => {
      ConfiguratorValuesStore.scene = undefined;
    };
  }, [scene]);

  return <></>;
};
