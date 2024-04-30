import {
  BVHBufferGeometry,
  traverseMeshes,
} from "@3dwebprodconf/shared/src/utilites/ThreeExtensions.ts";
import * as THREE from "three";
import { DRACOLoader, GLTFLoader, MeshoptDecoder } from "three-stdlib";

import { ProductSpecificationActions } from "../stores/actions/ProductSpecificationActions.ts";
import { ProductSpecificationStore } from "../stores/ProductSpecificationStore.ts";

import "three-mesh-bvh/src/index";
import { globalConfig } from "../configurations/Config.ts";
import { MeshBVHHelper } from "three-mesh-bvh";

function checkForCollision(
  newMesh: THREE.Mesh,
  scene: THREE.Scene,
  ignoredComponents?: string[]
) {
  let collisionDetected = false;
  if (globalConfig.config.debug.collisionDetectionDisplay) {
    scene.add(new THREE.BoxHelper(newMesh, 0xff0000));
  }
  traverseMeshes(scene, (sceneMesh) => {
    if (collisionDetected) {
      return;
    }

    const componentId = sceneMesh.userData.componentId as string | undefined;
    if (!componentId) {
      return;
    }

    if (ignoredComponents?.includes(componentId)) {
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
      if (globalConfig.config.debug.collisionDetectionDisplay) {
        scene.add(new MeshBVHHelper(sceneMesh));
      }

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

const dracoLoader = new DRACOLoader();

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

  if (componentSpec.ignoreCollisions) {
    return false;
  }

  const loader = new GLTFLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.5/"
  );
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(
    typeof MeshoptDecoder === "function" ? MeshoptDecoder() : MeshoptDecoder
  );

  const gltf = await loader.parseAsync(
    THREE.Cache.get(componentSpec.modelUrl) as ArrayBuffer,
    componentSpec.modelUrl
  );
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

  innerGroup.add(model);

  outerGroup.add(innerGroup);
  model.scale.multiplyScalar((componentSpec.collisionSensitivity ?? 99) / 100);
  outerGroup.updateMatrixWorld(true);

  let collisionDetected = false;

  traverseMeshes(outerGroup, (modelMesh) => {
    if (collisionDetected) {
      return;
    }
    if (checkForCollision(modelMesh, scene, ignoredComponents)) {
      collisionDetected = true;
    }
  });

  return collisionDetected;
}
