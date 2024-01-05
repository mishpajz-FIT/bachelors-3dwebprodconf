import {useBounds} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber/dist/declarations/src/core/events";
import {Euler, MathUtils} from "three";
import {useSnapshot} from "valtio";

import {GLTFRenderer} from "./GLTFRenderer.tsx";
import {MountingPointButton} from "./MountingPointButton.tsx";
import {appConfig} from "../../configurations/AppConfig.ts";
import {mountComponent, createNewComponent} from "../../stores/actions/UserProductActions.ts";
import {EditorValuesStore} from "../../stores/EditorValuesStore.ts";
import {ProductOptionsStore} from "../../stores/ProductOptionsStore.ts";
import {UserProductStore} from "../../stores/UserProductStore.ts";

interface ProductComponentProps {
  componentId: string;
  position?: readonly [number, number, number]
  rotation?: readonly [number, number, number]
}

export const ProductComponent = ({ componentId, position = [0, 0, 0], rotation = [0, 0, 0] }: ProductComponentProps) => {
  const bounds = useBounds();

  const productOptionsSnap = useSnapshot(ProductOptionsStore);
  const userProductSnap = useSnapshot(UserProductStore);

  if (productOptionsSnap?.isLoading) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product");
  }

  const userComponent = userProductSnap.components[componentId];

  if (!userComponent) {
    throw new Error(`Component ${componentId} not found`);
  }

  const componentOptions = productOptionsSnap.components.get(userComponent.componentProductId);

  if (!componentOptions) {
    throw new Error("Product ${userComponent.componentProductId} not found!");
  }

  const selectComponent = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    console.log("select " + componentId);

    if (EditorValuesStore.selectedComponentId === componentId) {
      EditorValuesStore.selectedComponentId = undefined;
      return;
    }

    EditorValuesStore.selectedComponentId = componentId;
  };

  const addNewComponent = (mountingPoint: string, newComponentProductId: string) => {
    const newComponentId = createNewComponent(newComponentProductId);
    mountComponent(componentId, mountingPoint, newComponentId);

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
      <GLTFRenderer
        componentId={componentId}
        position={[0,0,0]}
        onClick={selectComponent} />

      {componentOptions.mountingPoints.map(mp => {
        const attachedComponentId = userComponent.attachedComponents[mp.mountingPointId];

        if (attachedComponentId) {
          return (
            <ProductComponent
              key={attachedComponentId}
              componentId={attachedComponentId}
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
                console.log("new component" + newComponentProductId + " " + mp.mountingPointId + " " + componentId);
                addNewComponent(mp.mountingPointId, newComponentProductId);
              }}
            />
          );
        }
      })}
    </group>
  );
};
