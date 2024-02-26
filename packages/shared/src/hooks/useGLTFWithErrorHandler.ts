import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";

export function useGLTFWithErrorHandler(modelURL: string) {
  const [data, setData] = useState({
    scene: null,
    nodes: null,
    materials: null,
  });

  useEffect(() => {
    let isMounted = true;
    useGLTF
      .preload(modelURL)
      .then((loadedModel) => {
        if (isMounted) {
          setData({
            scene: loadedModel.scene,
            nodes: loadedModel.nodes,
            materials: loadedModel.materials,
          });
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.log("MAME PROBLEM");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [modelURL]);

  return { ...data };
}
