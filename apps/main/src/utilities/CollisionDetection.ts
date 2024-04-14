import {
  BVHBufferGeometry,
  traverseMeshes,
} from "@3dwebprodconf/shared/src/utilites/ThreeExtensions.ts";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { ProductSpecificationActions } from "../stores/actions/ProductSpecificationActions.ts";
import { ProductSpecificationStore } from "../stores/ProductSpecificationStore.ts";
import "three-mesh-bvh/src/index";

const COLLISION_TOLERANCE = 2;

function checkForCollision(
  newMesh: THREE.Mesh,
  scene: THREE.Scene,
  ignoredComponents?: string[]
) {
  let collisionDetected = false;

  traverseMeshes(scene, (sceneMesh) => {
    if (collisionDetected) {
      return;
    }

    const componentId = sceneMesh.userData.componentId as string | undefined;
    if (componentId && ignoredComponents?.includes(componentId)) {
      return;
    }

    const ignoreCollisions = sceneMesh.userData.ignoreCollisions as
      | boolean
      | undefined;
    if (ignoreCollisions) {
      return;
    }

    const sceneGeometry = sceneMesh.geometry as BVHBufferGeometry;
    if (sceneGeometry.boundsTree) {
      // Calculate relative transformation
      const transformMatrix = new THREE.Matrix4()
        .copy(sceneMesh.matrixWorld)
        .invert()
        .multiply(newMesh.matrixWorld);

      const result = sceneGeometry.boundsTree.intersectsGeometry(
        newMesh.geometry,
        transformMatrix
      );

      if (result) {
        collisionDetected = true;
      }
    }
  });

  return collisionDetected;
}

export async function willComponentCollide(
  componentSpecId: string,
  scene: THREE.Scene,
  position: THREE.Vector3,
  rotation: THREE.Euler,
  ignoredComponents?: string[]
): Promise<boolean> {
  const componentSpec = ProductSpecificationActions.getComponentSpec(
    componentSpecId,
    ProductSpecificationStore
  );

  const loader = new GLTFLoader();

  const gltf = await loader.loadAsync(componentSpec.modelUrl);
  const model = gltf.scene;

  const outerGroup = new THREE.Group();
  outerGroup.position.copy(position);
  outerGroup.rotation.copy(rotation);

  const innerGroup = new THREE.Group();
  innerGroup.position.copy(
    new THREE.Vector3().fromArray(componentSpec.positionOffset ?? [0, 0, 0])
  );
  innerGroup.rotation.copy(
    new THREE.Euler().fromArray(componentSpec.rotationOffset ?? [0, 0, 0])
  );
  innerGroup.scale.copy(
    new THREE.Vector3().fromArray(componentSpec.scaleOffset ?? [1, 1, 1])
  );

  const modelGroup = new THREE.Group();
  traverseMeshes(model, (modelMesh) => {
    modelGroup.add(modelMesh);
  });

  innerGroup.add(modelGroup);
  outerGroup.add(innerGroup);

  modelGroup.scale.multiplyScalar((100 - COLLISION_TOLERANCE) / 100);
  outerGroup.updateMatrixWorld(true);

  let collisionDetected = false;

  traverseMeshes(outerGroup, (modelMesh) => {
    if (!collisionDetected) {
      if (checkForCollision(modelMesh, scene, ignoredComponents)) {
        collisionDetected = true;
      }
    }
  });

  return collisionDetected;
}
