import {Box, PresentationControls, Stage} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {useSnapshot} from "valtio";

import {MountingPointButton} from "./MountingPointButton.tsx";
import {ProductConfigurationStore} from "../stores/ProductConfigurationStore.ts";
import {
  attachComponentInStore,
  createNewComponentInStore,
  UserProductStore
} from "../stores/UserProductStore.ts";

interface ProductComponentProps {
  userComponentId: string;
}

const ProductComponent = ({ userComponentId }: ProductComponentProps) => {
  const productConfigurationSnap = useSnapshot(ProductConfigurationStore);
  const userProductSnap = useSnapshot(UserProductStore);

  if (!productConfigurationSnap?.productConfiguration) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product");
  }

  const userComponent = userProductSnap.components[userComponentId];

  if (!userComponent) {
    throw new Error("User component not found");
  }

  const componentOptions = productConfigurationSnap.productConfiguration.components.find(comp => comp.id === userComponent.component);

  if (!componentOptions) {
    throw new Error("Component options not found!");
  }

  const addNewComponent = (mountingPoint: string, newComponent: string) => {
    const newComponentId = createNewComponentInStore(newComponent);
    attachComponentInStore(userComponentId, mountingPoint, newComponentId);
  };

  return (
    <group>
      {/* This renders the model of the current component */}
      <Box position={[0, 0, 0]} args={[1, 1, 1]} material-color="red" />
      {componentOptions.mountingPoints.map(mp => (
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
      ))}
      {Object.values(userComponent.attachedComponents).map(attachedComponentId => (
        <ProductComponent
          key={attachedComponentId}
          userComponentId={attachedComponentId}
        />
      ))}
    </group>
  );
};

export const ProductEditor = () => {
  const productConfigurationSnap = useSnapshot(ProductConfigurationStore);
  const userProductSnap = useSnapshot(UserProductStore);

  if (!productConfigurationSnap) {
    return <div>Loading configuration</div>;
  }

  if (!userProductSnap) {
    throw new Error("No user product");
  }

  return (
    <Canvas shadows style={{ touchAction: 'none' }}>
      <color attach="background" args={["#fefefe"]} />
      <PresentationControls
        speed={1.5}
        global
        zoom={0.7}
        polar={[-0.1, Math.PI / 4]}
      >
        <Stage
          preset="soft"
          environment="studio"
          intensity={0.2}
          adjustCamera
        >
          <ProductComponent
            key={userProductSnap.baseComponentId}
            userComponentId={userProductSnap.baseComponentId}
          />
        </Stage>
      </PresentationControls>
    </Canvas>
  );
};
