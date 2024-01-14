import { useBounds } from "@react-three/drei";
import { Euler, MathUtils } from "three";
import { useSnapshot } from "valtio";

import { ComponentModel } from "./ComponentModel.tsx";
import { MountingPointButton } from "./MountingPointButton.tsx";
import { appConfig } from "../../configurations/AppConfig.ts";
import {
  mountComponent,
  createNewComponent,
} from "../../stores/actions/UserProductActions.ts";
import { ProductSpecificationStore } from "../../stores/ProductSpecificationStore.ts";
import { UserProductStore } from "../../stores/UserProductStore.ts";

interface ComponentProps {
  componentId: string;
  position?: readonly [number, number, number];
  rotation?: readonly [number, number, number];
}

export const Component = ({
  componentId,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: ComponentProps) => {
  const bounds = useBounds();

  const productSpecsSnap = useSnapshot(ProductSpecificationStore);
  const userProductSnap = useSnapshot(UserProductStore);

  if (productSpecsSnap?.isLoading) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product!");
  }

  const component = userProductSnap.components[componentId];
  if (!component) {
    throw new Error(`Component ${componentId} not found!`);
  }

  const componentSpec =
    productSpecsSnap.componentSpecs[component.componentSpec];
  if (!componentSpec) {
    throw new Error(`Component specs ${component.componentSpec} not found!`);
  }

  const addNewComponent = (
    mountingPointSpecId: string,
    newComponentSpecId: string
  ) => {
    const newComponentId = createNewComponent(newComponentSpecId);
    mountComponent(componentId, mountingPointSpecId, newComponentId);

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
      <ComponentModel componentId={componentId} position={[0, 0, 0]} />

      {Object.entries(componentSpec.mountingPointsSpecs).map(
        ([mountingPointSpecId, mp]) => {
          const mountedComponentId = component.mounted[mountingPointSpecId];

          if (mountedComponentId) {
            return (
              <Component
                key={mountedComponentId}
                componentId={mountedComponentId}
                position={mp.position}
                rotation={mp.rotation}
              />
            );
          } else {
            return (
              <MountingPointButton
                key={mountingPointSpecId}
                position={mp.position}
                isRequired={mp.isRequired}
                mountableComponentsSpecs={mp.mountableComponents}
                add={(newComponentSpecId: string) => {
                  console.log(
                    "new component" +
                      newComponentSpecId +
                      ": " +
                      mountingPointSpecId +
                      " - " +
                      componentId
                  );
                  addNewComponent(mountingPointSpecId, newComponentSpecId);
                }}
              />
            );
          }
        }
      )}
    </group>
  );
};
