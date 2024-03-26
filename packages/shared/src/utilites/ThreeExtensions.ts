import * as THREE from "three";
import { MeshBVH } from "three-mesh-bvh";

export function traverseMeshes(
  object: THREE.Object3D,
  meshCallback: (mesh: THREE.Mesh) => void
) {
  object.traverse((child) => {
    if (child.type === "Mesh") {
      const mesh = child as THREE.Mesh;
      meshCallback(mesh);
    }
  });
}

export class BVHBufferGeometry extends THREE.BufferGeometry {
  boundsTree?: MeshBVH;
}
