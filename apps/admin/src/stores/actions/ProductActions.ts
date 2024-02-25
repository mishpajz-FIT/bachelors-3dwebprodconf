import { ProductStore } from "../ProductStore.ts";

export const removeComponentSpec = (componentSpecId: string) => {
  Object.keys(ProductStore.baseSpecs).forEach((baseSpecId) => {
    if (ProductStore.baseSpecs[baseSpecId].component === componentSpecId) {
      delete ProductStore.baseSpecs[baseSpecId];
    }
  });

  Object.keys(ProductStore.componentSpecs).forEach((iterComponentSpecId) => {
    const iterComponentSpec = ProductStore.componentSpecs[iterComponentSpecId];
    Object.keys(iterComponentSpec.mountingPointsSpecs).forEach(
      (iterMountingPointId) => {
        const iterMountPoint =
          iterComponentSpec.mountingPointsSpecs[iterMountingPointId];
        iterMountPoint.mountableComponents =
          iterMountPoint.mountableComponents.filter(
            (component) => component !== componentSpecId
          );
      }
    );
  });

  delete ProductStore.componentSpecs[componentSpecId];
};
