import { GenericActions } from "./GenericActions.ts";
import {
  ComponentSpecification,
  MaterialSpecification,
  ProductSpecification,
} from "../../schemas/ProductSpecification.ts";

export class GenericProductSpecificationActions extends GenericActions {
  static getComponentSpec(
    componentSpecId: string,
    store: ProductSpecification
  ) {
    return this.get(
      componentSpecId,
      store.componentSpecs,
      "Component specification"
    );
  }

  static getMountingPointSpec(
    componentSpec: ComponentSpecification,
    mountingPointSpecId: string
  ) {
    return this.get(
      mountingPointSpecId,
      componentSpec.mountingPointsSpecs,
      "Mounting point specification"
    );
  }

  static getMaterialSpec(
    componentSpec: ComponentSpecification,
    materialSpecId: string
  ) {
    return this.get(
      materialSpecId,
      componentSpec.materialSpecs,
      "Material specification"
    );
  }

  static getColorSpec(
    materialSpec: MaterialSpecification,
    colorSpecId: string
  ) {
    return this.get(
      colorSpecId,
      materialSpec.colorVariationsSpecs,
      "Color specification"
    );
  }

  static removeBaseSpec(baseSpecId: string, store: ProductSpecification) {
    delete store.baseSpecs[baseSpecId];
  }

  static removeComponentSpec(
    componentSpecId: string,
    store: ProductSpecification
  ) {
    Object.keys(store.baseSpecs).forEach((baseSpecId) => {
      if (store.baseSpecs[baseSpecId] === componentSpecId) {
        this.removeBaseSpec(baseSpecId, store);
      }
    });

    Object.values(store.componentSpecs).forEach((componentSpec) => {
      Object.values(componentSpec.mountingPointsSpecs).forEach((mountPoint) => {
        mountPoint.mountableComponents = mountPoint.mountableComponents.filter(
          (component) => component !== componentSpecId
        );
      });
    });

    delete store.componentSpecs[componentSpecId];
  }

  static removeMountingPointSpec(
    componentSpec: ComponentSpecification,
    mountingPointSpecId: string
  ) {
    delete componentSpec.mountingPointsSpecs[mountingPointSpecId];
  }

  static removeMaterialSpec(
    componentSpec: ComponentSpecification,
    materialSpecId: string
  ) {
    delete componentSpec.materialSpecs[materialSpecId];
  }

  static removeColorSpec(
    materialSpec: MaterialSpecification,
    colorSpecId: string
  ) {
    delete materialSpec.colorVariationsSpecs[colorSpecId];
  }

  static baseSpecExists(
    baseSpecId: string,
    store: ProductSpecification
  ): boolean {
    return Object.prototype.hasOwnProperty.call(store.baseSpecs, baseSpecId);
  }

  static componentSpecExists(
    componentSpecId: string,
    store: ProductSpecification
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

  static validateMountingPoints(
    componentSpecs: Record<string, ComponentSpecification>
  ): Record<string, string[]> {
    return Object.entries(componentSpecs).reduce(
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

  static validateMaterials(
    componentSpecs: Record<string, ComponentSpecification>
  ): Record<string, string[]> {
    return Object.entries(componentSpecs).reduce(
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

  static clearProductSpecification(store: ProductSpecification) {
    store.componentSpecs = {};
    store.baseSpecs = {};
  }

  static storeProductSpecification(
    productSpec: ProductSpecification,
    store: ProductSpecification
  ) {
    this.clearProductSpecification(store);
    Object.assign(store, productSpec);
  }
}
