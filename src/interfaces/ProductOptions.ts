
export interface ColorVariation {
    value: string; // Color
    price?: number; // Price for this color
}

export interface ConfigurableMaterial {
    id: string; // Unique id (in given component)
    names: string[]; // Names of materials in the 3D model
    colorVariations: ColorVariation[]; // Possible colors
}

export interface MountingPoint {
    id: string; // Unique id (in given component)
    position: [number, number, number]; // Coordinates
    rotation: [number, number, number]; // Pitch, yaw, roll in euler angles
    isRequired: boolean; // Does component need to be mounted here?
    obstructedMountingPoints: string[]; // Ids of mounting points that are obstructed by these
    mountableComponents: string[]; // Ids of components that can be mounted
}

export interface Component {
    id: string; // Unique id
    price?: number; // Price for this component
    name: string; // Readable name of this component
    modelUrl: string; // URL to GLTF model file
    materials: ConfigurableMaterial[]; // Changeable materials of this component
    mountingPoints: MountingPoint[]; // Mountable points for this component
}

export interface Base {
    id: string; // Unique id
    name: string; // Readable name of this base
    component: string; // id of component that can be used as the base
    backgroundUrl: string; // URL to HDRI file for background
}

export interface ProductOptions {
    bases: Base[];
    components: Component[];
}
