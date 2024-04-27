import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Scene } from "three";

import { ConfiguratorValuesNonReactiveStore } from "../../stores/ConfiguratorValuesStore.ts";

interface SceneStorerProps {
  setSceneLoaded: () => void;
}

export const SceneStorer = ({ setSceneLoaded }: SceneStorerProps) => {
  const { scene } = useThree();
  const storedSceneRef = useRef<Scene>();

  const [isFirstFrameRendered, setIsFirstFrameRendered] = useState(false);

  useEffect(() => {
    if (storedSceneRef.current !== scene) {
      storedSceneRef.current = scene;
      ConfiguratorValuesNonReactiveStore.scene = scene;
    }
  }, [scene]);

  useFrame(() => {
    if (!isFirstFrameRendered) {
      setIsFirstFrameRendered(true);
      setSceneLoaded();
    }
  });

  return <></>;
};
