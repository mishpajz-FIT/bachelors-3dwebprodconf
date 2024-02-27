import { downloadableJson } from "@3dwebprodconf/shared/src/utilites/downloadableJson.ts";

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

export const exportProduct = () => {
  downloadableJson(JSON.stringify(ProductStore), "productspecification");
};

export const missingComponentsInMountingPoints = () => {
  const result: Record<string, string[]> = {};

  Object.entries(ProductStore.componentSpecs).forEach(
    ([componentId, componentSpec]) => {
      const emptyMountingPoints = Object.keys(
        componentSpec.mountingPointsSpecs
      ).filter(
        (mountingPointId) =>
          componentSpec.mountingPointsSpecs[mountingPointId].mountableComponents
            .length === 0
      );

      if (emptyMountingPoints.length > 0) {
        result[componentId] = emptyMountingPoints;
      }
    }
  );

  return result;
};

export const missingColorsInMaterials = () => {
  const result: Record<string, string[]> = {};

  Object.entries(ProductStore.componentSpecs).forEach(
    ([componentId, componentSpec]) => {
      const materialsWithNoColors = Object.keys(
        componentSpec.materialSpecs
      ).filter((materialId) => {
        const material = componentSpec.materialSpecs[materialId];
        return Object.keys(material.colorVariationsSpecs).length === 0;
      });

      if (materialsWithNoColors.length > 0) {
        result[componentId] = materialsWithNoColors;
      }
    }
  );

  return result;
};

export const missingModelsInMaterials = () => {
  const result: Record<string, string[]> = {};

  Object.entries(ProductStore.componentSpecs).forEach(
    ([componentId, componentSpec]) => {
      const materialsWithNoModels = Object.keys(
        componentSpec.materialSpecs
      ).filter((materialId) => {
        const material = componentSpec.materialSpecs[materialId];
        return material.modelMaterials.length === 0;
      });

      if (materialsWithNoModels.length > 0) {
        result[componentId] = materialsWithNoModels;
      }
    }
  );

  return result;
};
