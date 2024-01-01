
export interface ColorVariation {
    value: string; // Color
    price?: number; // Price for this color
}

export interface ConfigurableMaterial {
    materialId: string; // Unique id (in given component)
    names: string[]; // Names of materials in the 3D model
    colorVariations: ColorVariation[]; // Possible colors
}

export interface MountingPoint {
    mountingPointId: string; // Unique id (in given component)
    position: [number, number, number]; // Coordinates
    rotation: [number, number, number]; // Pitch, yaw, roll in euler angles
    isRequired: boolean; // Does component need to be mounted here?
    obstructedMountingPoints: string[]; // MountingPointIds that are obstructed by this one
    mountableComponents: string[]; // ProductIds of components that can be mounted
}

export interface Component {
    productId: string; // Unique id
    price?: number; // Price for this component
    name: string; // Readable name of this component
    description: string; // Readable description of this component
    imageUrl: string; // URL to image preview of component
    modelUrl: string; // URL to GLTF model file
    materials: ConfigurableMaterial[]; // Changeable materials of this component
    mountingPoints: MountingPoint[]; // Mountable points for this component
}

export interface Base {
    baseId: string; // Unique id
    name: string; // Readable name of this base
    component: string; // product id of component that can be used as the base
    backgroundUrl: string; // URL to HDRI file for background
}

export interface ProductOptions {
    bases: Base[];
    components: Component[];
}
