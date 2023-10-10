import { PresentationControls, Stage } from "@react-three/drei";
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Mesh, Object3D } from 'three';

const updateMaterialColor = (gltf: GLTF) => {

  gltf.scene.getObjectByName('Pillow_Material_#10_0')?.traverse((node: Object3D) => {
    if (node instanceof Mesh) {
      console.log(node);
      node.material.color.set(0xffc0cb);
    }
  });
}

const Experience = () => {
  const gltf = useLoader(GLTFLoader, 'https://storage.googleapis.com/www.halwa.ca/chair-model/scene.gltf')

  return (
    <PresentationControls
      speed={1.5}
      global
      zoom={0.7}
      polar={[-0.1, Math.PI / 4]}
    >
      <Stage environment="city" intensity={0.6} adjustCamera>
        <primitive object={gltf.scene} />
        <mesh position={[1, 0, 0]} onClick={(event) => {
          console.log(event);
          updateMaterialColor(gltf);
        }}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial attach="material" color="blue" />
        </mesh>
      </Stage>
    </PresentationControls>
    );
}

export default Experience;