
export interface UserComponent {
    component: string; // id of component
    mountingPoint: string; // Mounting point where this component is mounted to
    configuredMaterials: readonly [string, string][] // ids of materials and ids of their selected colors
    attachedComponents: readonly UserComponent[]; // recursively attached components
}

export interface UserProduct {
    baseComponent: string; // id of base component
    configuredMaterials: [string, string][] // ids of materials and ids of their selected colors
    attachedComponents: UserComponent[]; // attached components
}
