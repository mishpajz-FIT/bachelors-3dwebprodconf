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
}
