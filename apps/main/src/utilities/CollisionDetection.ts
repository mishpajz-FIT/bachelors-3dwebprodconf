import {
  BVHBufferGeometry,
  traverseMeshes,
} from "@3dwebprodconf/shared/src/utilites/ThreeExtensions.ts";
import * as THREE from "three";
import { MeshBVHHelper } from "three-mesh-bvh/src/index";
import { DRACOLoader, GLTFLoader, MeshoptDecoder } from "three-stdlib";

import { globalConfig } from "../configurations/Config.ts";
import { ProductSpecificationActions } from "../stores/actions/ProductSpecificationActions.ts";
import { ProductSpecificationStore } from "../stores/ProductSpecificationStore.ts";

function checkForCollision(
  newMesh: THREE.Mesh,
  scene: THREE.Scene,
  ignoredComponents?: string[]
) {
  if (!newMesh.geometry.boundingBox) {
    newMesh.geometry.computeBoundingBox();
  }

  if (globalConfig.config.debug.collisionDetectionDisplay) {
    const copyBox = new THREE.Box3();
    copyBox
      .copy(newMesh.geometry.boundingBox!)
      .applyMatrix4(newMesh.matrixWorld);
    scene.add(new THREE.Box3Helper(copyBox, "#ff0000"));
  }

  let collisionDetected = false;
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

      const result = sceneGeometry.boundsTree.intersectsBox(
        newMesh.geometry.boundingBox!,
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
