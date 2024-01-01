import {Edges, useBounds} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {Euler, MathUtils} from "three";
import {useSnapshot} from "valtio";

import {MountingPointButton} from "./MountingPointButton.tsx";
import {appConfig} from "../../configurations/AppConfig.ts";
import {EditorValuesStore} from "../../stores/EditorValuesStore.ts";
import {ProductOptionsStore} from "../../stores/ProductOptionsStore.ts";
import {mountComponentInStore, createNewComponent, UserProductStore} from "../../stores/UserProductStore.ts";

interface ProductComponentProps {
  userComponentId: string;
  position?: readonly [number, number, number]
  rotation?: readonly [number, number, number]
}

export const ProductComponent = ({ userComponentId, position = [0, 0, 0], rotation = [0, 0, 0] }: ProductComponentProps) => {
  const bounds = useBounds();

  const productOptionsSnap = useSnapshot(ProductOptionsStore);
  const userProductSnap = useSnapshot(UserProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  if (productOptionsSnap?.isLoading) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product");
  }

  const userComponent = userProductSnap.components[userComponentId];

  if (!userComponent) {
    throw new Error("User component not found");
  }

  const componentOptions = productOptionsSnap.components.get(userComponent.componentProductId);

  if (!componentOptions) {
    throw new Error("Component options not found!");
  }

  const selectComponent = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    console.log("selected " + userComponentId);

    if (EditorValuesStore.selectedComponentId === userComponentId) {
      EditorValuesStore.selectedComponentId = undefined;
      return;
    }

    EditorValuesStore.selectedComponentId = userComponentId;
  };

  const addNewComponent = (mountingPoint: string, newComponentProductId: string) => {
    const newComponentId = createNewComponent(newComponentProductId);
    mountComponentInStore(userComponentId, mountingPoint, newComponentId);

    bounds.refresh();
    if (appConfig.camera.isOrthogonal) {
      bounds.reset();
    }
    bounds.clip();
    bounds.fit();
  };

  const [rotationX, rotationY, rotationZ] = rotation;
  const radiansRotation = new Euler(
    MathUtils.degToRad(rotationX),
    MathUtils.degToRad(rotationY),
    MathUtils.degToRad(rotationZ),
    "XYZ"
  );

  return (
    <group position={position} rotation={radiansRotation}>
      {/* This renders the model of the current component */}
      <mesh
        position={[0, 0, 0]}
        onClick={selectComponent}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={"orange"} />
        <Edges visible={userComponentId === editorValuesSnap.selectedComponentId} scale={1.05}>
          <meshBasicMaterial transparent={true} color={appConfig.spacialUi.selectionColors.outline} depthTest={false} />
        </Edges>
      </mesh>
      {componentOptions.mountingPoints.map(mp => {
        const attachedComponentId = userComponent.attachedComponents[mp.mountingPointId];

        if (attachedComponentId) {
          return (
            <ProductComponent
              key={attachedComponentId}
              userComponentId={attachedComponentId}
              position={mp.position}
              rotation={mp.rotation}
            />
          );
        } else {
          return (
            <MountingPointButton
              key={mp.mountingPointId}
              position={mp.position}
              isRequired={mp.isRequired}
              mountableComponents={mp.mountableComponents}
              add={(newComponentProductId: string) => {
                console.log("new component" + newComponentProductId + " " + mp.mountingPointId + " " + userComponentId);
                addNewComponent(mp.mountingPointId, newComponentProductId);
              }}
            />
          );
        }
      })}
    </group>
  );
};
