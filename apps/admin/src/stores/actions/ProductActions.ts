import {
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

  static removeBaseSpec(baseSpecId: string, store: typeof ProductStore) {
    delete store.baseSpecs[baseSpecId];
  }

  static removeComponentSpec(
    componentSpecId: string,
    store: typeof ProductStore
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

  static addBaseSpec(
    baseSpecId: string,
    componentSpecId: string,
    store: typeof ProductStore
  ) {
    store.baseSpecs[baseSpecId] = componentSpecId;
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
    return GenericProductSpecificationActions.validateMountingPoints(
      store.componentSpecs
    );
  }

  static missingColorsInMaterials(
    store: typeof ProductStore
  ): Record<string, string[]> {
    return GenericProductSpecificationActions.validateMaterials(
      store.componentSpecs
    );
  }

  static clearProductSpecification(store: typeof ProductStore) {
    store.componentSpecs = {};
    store.baseSpecs = {};
  }

  static storeProductSpecification(
    productSpec: ProductSpecification,
    store: typeof ProductStore
  ) {
    ProductActions.clearProductSpecification(store);
    Object.assign(store, productSpec);
  }
}
