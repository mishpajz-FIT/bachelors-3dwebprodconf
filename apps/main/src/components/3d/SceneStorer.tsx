import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Scene } from "three";

import { ConfiguratorValuesNonReactiveStore } from "../../stores/ConfiguratorValuesStore.ts";

export const SceneStorer = () => {
  const { scene } = useThree();
  const storedSceneRef = useRef<Scene>();

  useEffect(() => {
    if (storedSceneRef.current !== scene) {
      storedSceneRef.current = scene;
      ConfiguratorValuesNonReactiveStore.scene = scene;
    }
  }, [scene]);

  return <></>;
};
