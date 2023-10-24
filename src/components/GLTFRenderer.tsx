import { useLoader } from '@react-three/fiber';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

interface GLTFRendererProps {
  modelUrl: string
}
export const GLTFRenderer = ({ modelUrl }: GLTFRendererProps) => {
  const gltf = useLoader(GLTFLoader, modelUrl) as GLTF;
  
  return <primitive object={gltf.scene}></primitive>;
}