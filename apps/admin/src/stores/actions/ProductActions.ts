import {
  BaseSpecification,
  ColorSpecification,
  ComponentSpecification,
  MaterialSpecification,
  MountingPointSpecification,
  ProductSpecification,
} from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { GenericProductSpecificationActions } from "@3dwebprodconf/shared/src/stores/actions/GenericProductSpecificationActions.ts";

import { ProductStore } from "../ProductStore.ts";

export class ProductActions extends GenericProductSpecificationActions {
  static getComponentSpec(
    componentSpecId: string,
    store: typeof ProductStore
  ): ComponentSpecification {
    return this.get(
      componentSpecId,
      store.componentSpecs,
      "Component specification"
    );
  }

  static removeComponentSpec(
    componentSpecId: string,
    store: typeof ProductStore
  ) {
    for (const baseSpecId in store.baseSpecs) {
      if (store.baseSpecs[baseSpecId].component === componentSpecId) {
        delete store.baseSpecs[baseSpecId];
      }
    }

    Object.values(store.componentSpecs).forEach((componentSpec) => {
      Object.values(componentSpec.mountingPointsSpecs).forEach((mountPoint) => {
        mountPoint.mountableComponents = mountPoint.mountableComponents.filter(
          (component) => component !== componentSpecId
        );
      });
    });

    delete store.componentSpecs[componentSpecId];
  }

  static addBaseSpec(
    baseSpecId: string,
    baseSpec: BaseSpecification,
    store: typeof ProductStore
  ) {
    store.baseSpecs[baseSpecId] = baseSpec;
  }

  static addComponentSpec(
    componentSpecId: string,
    componentSpec: ComponentSpecification,
    store: typeof ProductStore
  ) {
    store.componentSpecs[componentSpecId] = componentSpec;
  }

  static addMountingPointSpec(
    mountingPointId: string,
    mountingPointSpec: MountingPointSpecification,
    componentSpec: ComponentSpecification
  ) {
    componentSpec.mountingPointsSpecs[mountingPointId] = mountingPointSpec;
  }

  static addMaterialSpec(
    materialSpecId: string,
    materialSpec: MaterialSpecification,
    componentSpec: ComponentSpecification
  ) {
    componentSpec.materialSpecs[materialSpecId] = materialSpec;
  }

  static addColorSpec(
    colorSpecId: string,
    colorSpec: ColorSpecification,
    materialSpec: MaterialSpecification
  ) {
    materialSpec.colorVariationsSpecs[colorSpecId] = colorSpec;
  }

  static baseSpecExists(
    baseSpecId: string,
    store: typeof ProductStore
  ): boolean {
    return Object.prototype.hasOwnProperty.call(store.baseSpecs, baseSpecId);
  }

  static componentSpecExists(
    componentSpecId: string,
    store: typeof ProductStore
  ): boolean {
    return Object.prototype.hasOwnProperty.call(
      store.componentSpecs,
      componentSpecId
    );
  }

  static mountingPointSpecExists(
    componentSpec: ComponentSpecification,
    mountingPointSpecId: string
  ): boolean {
    return Object.prototype.hasOwnProperty.call(
      componentSpec.mountingPointsSpecs,
      mountingPointSpecId
    );
  }

  static materialSpecExists(
    componentSpec: ComponentSpecification,
    materialSpecId: string
  ): boolean {
    return Object.prototype.hasOwnProperty.call(
      componentSpec.materialSpecs,
      materialSpecId
    );
  }

  static colorSpecExists(
    materialSpec: MaterialSpecification,
    colorSpecId: string
  ): boolean {
    return Object.prototype.hasOwnProperty.call(
      materialSpec.colorVariationsSpecs,
      colorSpecId
    );
  }

  static missingComponentsInMountingPoints(
    store: typeof ProductStore
  ): Record<string, string[]> {
    return Object.entries(store.componentSpecs).reduce(
      (acc, [componentId, componentSpec]) => {
        const emptyMountingPoints = Object.entries(
          componentSpec.mountingPointsSpecs
        )
          .filter(
            ([_, mountPoint]) => mountPoint.mountableComponents.length === 0
          )
          .map(([mountingPointId, _]) => mountingPointId);

        if (emptyMountingPoints.length > 0) {
          acc[componentId] = emptyMountingPoints;
        }

        return acc;
      },
      {} as Record<string, string[]>
    );
  }

  static missingColorsInMaterials(
    store: typeof ProductStore
  ): Record<string, string[]> {
    return Object.entries(store.componentSpecs).reduce(
      (acc, [componentId, componentSpec]) => {
        const materialsWithNoColors = Object.keys(
          componentSpec.materialSpecs
        ).filter((materialId) => {
          const material = componentSpec.materialSpecs[materialId];
          return Object.keys(material.colorVariationsSpecs).length === 0;
        });

        if (materialsWithNoColors.length > 0) {
          acc[componentId] = materialsWithNoColors;
        }

        return acc;
      },
      {} as Record<string, string[]>
    );
  }

  static missingModelsInMaterials(
    store: typeof ProductStore
  ): Record<string, string[]> {
    return Object.entries(store.componentSpecs).reduce(
      (acc, [componentId, componentSpec]) => {
        const materialsWithNoModels = Object.keys(
          componentSpec.materialSpecs
        ).filter((materialId) => {
          const material = componentSpec.materialSpecs[materialId];
          return material.modelMaterials.length === 0;
        });

        if (materialsWithNoModels.length > 0) {
          acc[componentId] = materialsWithNoModels;
        }

        return acc;
      },
      {} as Record<string, string[]>
    );
  }

  static storeProductSpecification(
    productSpec: ProductSpecification,
    store: typeof ProductStore
  ) {
    store.componentSpecs = {};
    store.baseSpecs = {};
    Object.assign(store, productSpec);
  }
}
