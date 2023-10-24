import {Box, PresentationControls, Stage} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {useSnapshot} from "valtio";

//import {GLTFRenderer} from "./GLTFRenderer.tsx";
import {MountingPointButton} from "./MountingPointButton.tsx";
import {UserComponent} from "../interfaces/UserProduct.ts";
import {productConfigurationStore, userProductStore} from "../stores/store.ts";

type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
interface ProductComponentProps {
  userComponent: DeepReadonly<UserComponent>;
}

const ProductComponent = ({ userComponent }: ProductComponentProps) => {
  const productConfigurationSnap = useSnapshot(productConfigurationStore);

  if (!productConfigurationSnap?.productConfiguration) {
    return <div>Loading configuration</div>;
  }

  const component = productConfigurationSnap.productConfiguration.components.find(comp => comp.id === userComponent.component);

  if (!component) {
    throw new Error("Component configuration not found!");
  }

  return (
    <group>
      {/* This renders the model of the current component */}
      <Box position={[0, 0, 0]} args={[1, 1, 1]} material-color="red" />
      {component.mountingPoints.map(mp => (
        <MountingPointButton
          key={mp.id}
          id={mp.id}
          position={mp.position}
          onClick={() => console.log("new component!") /* Handle adding new component */}
        />
      ))}
      {userComponent.attachedComponents.map(attachedComponent => (
        <ProductComponent
          key={attachedComponent.component}
          userComponent={attachedComponent}
        />
      ))}
    </group>
  );
};

export const ProductEditor = () => {
  const productConfigurationSnap = useSnapshot(productConfigurationStore);
  const userProductSnap = useSnapshot(userProductStore);

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
          {userProductSnap.userProduct.attachedComponents.map(attachedComp => (
            <ProductComponent
              key={attachedComp.component}
              userComponent={attachedComp}
            />
          ))}
        </Stage>
      </PresentationControls>
    </Canvas>
  );
};
