import { Canvas } from "@react-three/fiber";

import {GLTFRenderer} from "./GLTFRenderer.tsx";
import {MountingPointButton} from "./MountingPointButton.tsx";
import {useProductConfiguration} from "../contexts/ProductConfigurationContext";
import {useUserProduct} from "../contexts/UserProductContext.ts";
import {UserComponent} from "../interfaces/UserProduct.ts";
import {Box, PresentationControls, Stage} from "@react-three/drei";

interface ProductComponentProps {
  componentId: string;
  configuredMaterials?: [string, string][];
  attachedComponents?: UserComponent[];
}

const ProductComponent = ({ componentId, configuredMaterials, attachedComponents = [] }: ProductComponentProps) => {
  const productConfiguration = useProductConfiguration();

  if (!productConfiguration) {
    return <div>Loading configuration</div>;
  }

  const component = productConfiguration.components.find(comp => comp.id === componentId);

  if (!component) {
    throw new Error("Component not found!");
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
      {attachedComponents.map(attachedComponent => (
        <ProductComponent
          key={attachedComponent.componentId}
          componentId={attachedComponent.componentId}
          configuredMaterials={attachedComponent.configuredMaterials}
          attachedComponents={attachedComponent.attachedComponents}
        />
      ))}
    </group>
  );
};

export const ProductEditor = () => {
  const productConfiguration = useProductConfiguration();
  const [userProduct, setUserProduct] = useUserProduct();

  if (!productConfiguration) {
    return <div>Loading configuration</div>;
  }

  if (!userProduct) {
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
            componentId={userProduct.baseComponentId}
            attachedComponents={userProduct.attachedComponents}
          />
        </Stage>
      </PresentationControls>
    </Canvas>
  );
};
