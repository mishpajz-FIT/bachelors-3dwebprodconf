import {Edges, useBounds} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {Euler, MathUtils} from "three";
import {useSnapshot} from "valtio";

import {MountingPointButton} from "./MountingPointButton.tsx";
import {appConfig} from "../configurations/AppConfig.ts";
import {EditorValuesStore} from "../stores/EditorValuesStore.ts";
import {ProductOptionsStore} from "../stores/ProductOptionsStore.ts";
import {attachComponentInStore, createNewComponentInStore, UserProductStore} from "../stores/UserProductStore.ts";

interface ProductComponentProps {
  userComponentId: string;
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export const ProductComponent = ({ userComponentId, position = [0, 0, 0], rotation = [0, 0, 0] }: ProductComponentProps) => {
  const bounds = useBounds();

  const productOptionsSnap = useSnapshot(ProductOptionsStore);
  const userProductSnap = useSnapshot(UserProductStore);
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  if (!productOptionsSnap?.productOptions) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product");
  }

  const userComponent = userProductSnap.components[userComponentId];

  if (!userComponent) {
    throw new Error("User component not found");
  }

  const componentOptions = productOptionsSnap.productOptions.components.find(comp => comp.id === userComponent.component);

  if (!componentOptions) {
    throw new Error("Component options not found!");
  }

  const selectComponent = (event: ThreeEvent<MouseEvent>) => {
    EditorValuesStore.selectedComponentId = userComponentId;
    console.log("selected " + userComponentId);
    event.stopPropagation();
  };

  const addNewComponent = (mountingPoint: string, newComponent: string) => {
    const newComponentId = createNewComponentInStore(newComponent);
    attachComponentInStore(userComponentId, mountingPoint, newComponentId);

    bounds.refresh();
    bounds.clip();
    bounds.fit();
  };

  const mountingPointLocation = (mountingPointId: string): { position?: [number, number, number], rotation?: [number, number, number] } => {
    const mp = componentOptions.mountingPoints.find(m => m.id === mountingPointId);
    return {
      position: mp?.position ? [mp.position[0], mp.position[1], mp.position[2]] : undefined,
      rotation: mp?.rotation ? [mp.rotation[0], mp.rotation[1], mp.rotation[2]] : undefined,
    };
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
        const attachedComponentId = userComponent.attachedComponents[mp.id];
        const { position, rotation } = mountingPointLocation(mp.id);

        if (attachedComponentId) {
          return (
            <ProductComponent
              key={attachedComponentId}
              userComponentId={attachedComponentId}
              position={position}
              rotation={rotation}
            />
          );
        } else {
          return (
            <MountingPointButton
              key={mp.id}
              id={mp.id}
              position={mp.position}
              onClick={() => {
                const newComponentType = "comp1";
                console.log("new component" + newComponentType + " " + mp.id + " " + userComponentId);
                addNewComponent(mp.id, newComponentType);
              }}
            />
          );
        }
      })}
    </group>
  );
};
