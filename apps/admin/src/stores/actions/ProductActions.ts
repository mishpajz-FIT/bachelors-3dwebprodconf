import {
  ColorSpecification,
  ComponentSpecification,
  MaterialSpecification,
  MountingPointSpecification,
} from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { GenericProductSpecificationActions } from "@3dwebprodconf/shared/src/stores/actions/GenericProductSpecificationActions.ts";

import { ProductStore } from "../ProductStore.ts";

export class ProductActions extends GenericProductSpecificationActions {
  static addBaseSpec(
    baseSpecId: string,
    componentSpecId: string,
    store: ProductStore
  ) {
    store.baseSpecs[baseSpecId] = componentSpecId;
  }

  static addComponentSpec(
    componentSpecId: string,
    componentSpec: ComponentSpecification,
    store: ProductStore
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
}
