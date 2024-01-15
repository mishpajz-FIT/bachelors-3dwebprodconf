export interface ColorSpecification {
  name: string;
  value: string;
  price?: number;
}

export interface MaterialSpecification {
  name: string;
  modelMaterials: string[];
  colorVariationsSpecs: Record<string, ColorSpecification>;
}

export interface MountingPointSpecification {
  position: [number, number, number];
  rotation: [number, number, number];
  isRequired: boolean;
  obstructedMountingPoints: string[];
  mountableComponents: string[];
}

export interface ComponentSpecification {
  price?: number;
  name: string;
  description: string;
  imageUrl: string;
  modelUrl: string;
  materialSpecs: Record<string, MaterialSpecification>;
  mountingPointsSpecs: Record<string, MountingPointSpecification>;
}

export interface BaseSpecification {
  component: string;
  backgroundUrl: string;
}

export interface ProductSpecification {
  baseSpecs: Record<string, BaseSpecification>;
  componentSpecs: Record<string, ComponentSpecification>;
}
