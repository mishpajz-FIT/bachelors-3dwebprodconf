
export interface UserComponent {
    componentProductId: string; // id of component from ProductConfiguration
    configuredMaterials: Record<string, string>; // ids of materials and ids of their selected colors
    attachedComponents: Record<string, string>; // ids of mountingPoints and ids of instances of attached components
}

export interface UserProduct {
    baseComponentId: string; // id of instance of base UserComponent
    components: Record<string, UserComponent>; // unique id and component instances used in this product
}
