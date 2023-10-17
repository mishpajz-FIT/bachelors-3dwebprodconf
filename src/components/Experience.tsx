import { PresentationControls, Stage } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Material, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const useGltfModel = (url: string) => {
  const [gltfModel, setGltfModel] = useState<GLTF | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => setGltfModel(gltf),
      undefined,
      () => setError(new Error("Failed to load the model"))
    );
  }, [url]);

  return { gltfModel, error };
};

const updateMaterialColor = (gltf: GLTF) => {

  const isMesh = (node: Object3D): node is Mesh => {
    return (node as Mesh).isMesh !== undefined;
  };

  const setColor = (material: Material) => {
    if (material instanceof MeshStandardMaterial) {
      material.color.set(0xffc0cb);
    }
  };

  gltf.scene.getObjectByName('Pillow_Material_#10_0')?.traverse((node: Object3D) => {
    if (isMesh(node)) {
      if (Array.isArray(node.material)) {
        for (const material of node.material) {
          setColor(material);
        }
      } else {
        setColor(node.material);
      }
    }
  });
};

interface ExperienceSceneProps { gltfModel: GLTF }

const ExperienceScene = ({ gltfModel }: ExperienceSceneProps) => {
  return (
    <PresentationControls
      speed={1.5}
      global
      zoom={0.7}
      polar={[-0.1, Math.PI / 4]}
    >
      <Stage
        preset="soft"
        environment="studio"
        intensity={0.2}
        adjustCamera
      >
        <primitive object={gltfModel.scene} />
        <mesh position={[1, 0, 0]} onClick={(event) => {
          console.log(event);
          updateMaterialColor(gltfModel);
        }}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial attach="material" color="blue" />
        </mesh>
      </Stage>
    </PresentationControls>
  );
};

export default function Experience() {

  const modelUrl = 'https://storage.googleapis.com/www.halwa.ca/chair-model/scene.gltf';
  const { gltfModel, error } = useGltfModel(modelUrl);

  if (error) {
    return <div>Error loading model: {error.message}</div>;
  }

  if (!gltfModel) {
    return <div>Loading...</div>;
  }

  return (
    <Canvas shadows>
      <color attach="background" args={["#fefefe"]} />
      <ExperienceScene gltfModel={gltfModel} />;
    </Canvas>
  );
}
