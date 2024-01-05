
export interface ColorSpecification {
    value: string;
    price?: number;
}

export interface MaterialSpecification {
    materialSpecId: string;
    modelMaterials: string[];
    colorVariationsSpecs: ColorSpecification[];
}

export interface MountingPointSpecification {
    mountingPointSpecId: string;
    position: [number, number, number];
    rotation: [number, number, number];
    isRequired: boolean;
    obstructedMountingPointSpecs: string[];
    mountableComponentSpecs: string[];
}

export interface ComponentSpecification {
    componentSpecId: string;
    price?: number;
    name: string;
    description: string;
    imageUrl: string;
    modelUrl: string;
    materialSpecs: MaterialSpecification[];
    mountingPointsSpecs: MountingPointSpecification[];
}

export interface BaseSpecification {
    baseSpecId: string;
    name: string;
    product: string;
    backgroundUrl: string;
}

export interface ProductSpecification {
    baseSpecs: BaseSpecification[];
    componentSpecs: ComponentSpecification[];
}
