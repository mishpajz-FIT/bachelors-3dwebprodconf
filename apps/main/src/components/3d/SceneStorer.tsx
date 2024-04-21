import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

import { ConfiguratorValuesNonReactiveStore } from "../../stores/ConfiguratorValuesStore.ts";

export const SceneStorer = () => {
  const { scene } = useThree();

  useEffect(() => {
    ConfiguratorValuesNonReactiveStore.scene = scene;

    return () => {
      ConfiguratorValuesNonReactiveStore.scene = undefined;
    };
  }, [scene]);

  return <></>;
};
