import { GenericActions } from "./GenericActions.ts";
import {
  ComponentSpecification,
  MaterialSpecification,
} from "../../schemas/ProductSpecification.ts";

export class GenericProductSpecificationActions extends GenericActions {
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
}
