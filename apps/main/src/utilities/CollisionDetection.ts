import { ProductSpecificationActions } from "../stores/actions/ProductSpecificationActions.ts";
import { ProductSpecificationStore } from "../stores/ProductSpecificationStore.ts";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

function checkForCollision(newMesh, scene) {
  let collisionDetected = false;

  scene.traverse((child) => {
    if (child.type === "Mesh") {
      if (child.geometry.boundsTree) {
        const result = child.geometry.boundsTree.intersectsGeometry(
          newMesh.geometry,
          newMesh.matrixWorld
        );

        if (result) {
          collisionDetected = true;
          return;
        }
      }
    }
  });

  return collisionDetected;
}

export async function willComponentCollide(
  componentSpecId: string,
  scene: THREE.Scene,
  position,
  rotation
): Promise<boolean> {
  const componentSpec = ProductSpecificationActions.getComponentSpec(
    componentSpecId,
    ProductSpecificationStore
  );

  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(componentSpec.modelUrl, (gltf: GLTF) => {
      const model = gltf.scene;
      model.scale.copy(componentSpec.scaleOffset ?? [1, 1, 1]);

      const outerGroup = new THREE.Group();
      outerGroup.position.copy(position);
      outerGroup.rotation.copy(rotation);

      const innerGroup = new THREE.Group();
      innerGroup.position.copy(componentSpec.positionOffset);
      innerGroup.position.copy(componentSpec.rotationOffset);

      innerGroup.add(model);
      outerGroup.add(innerGroup);

      let collisionDetected = false;

      outerGroup.traverse((child) => {
        if (child.type === "Mesh") {
          if (checkForCollision(child, scene)) {
            collisionDetected = true;
            return;
          }
        }
      });

      resolve(collisionDetected);
    });
  });
}
