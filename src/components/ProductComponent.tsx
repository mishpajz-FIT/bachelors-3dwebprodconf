import {Box, useBounds} from "@react-three/drei";
import {Euler, MathUtils} from "three";
import {useSnapshot} from "valtio";

import {MountingPointButton} from "./MountingPointButton.tsx";
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

  const selectComponent = () => {
    EditorValuesStore.selectedComponentId = userComponentId;
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
      <Box
        position={[0, 0, 0]}
        args={[1, 1, 1]}
        material-color={editorValuesSnap.selectedComponentId === userComponentId ? "green" : "red"}
        onClick={selectComponent}
      />
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
                addNewComponent(mp.id, newComponentType);
                console.log("new component");
              }}
            />
          );
        }
      })}
    </group>
  );
};
