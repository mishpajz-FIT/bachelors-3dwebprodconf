
export interface UserComponent {
    componentId: string; // id of this component
    mountingPointId: string; // Mounting point where this component is mounted to
    configuredMaterials: [string, string] // ids of materials and ids of their selected colors
    attachedComponents: UserComponent[]; // recursively attached components
}

export interface UserProduct {
    baseComponentId: string; // id of base component
    configuredMaterials: [string, string] // ids of materials and ids of their selected colors
    attachedComponents: UserComponent[]; // attached components
}
