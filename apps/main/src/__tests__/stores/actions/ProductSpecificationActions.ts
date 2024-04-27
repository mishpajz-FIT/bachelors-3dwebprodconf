import {
  ColorSpecificationSchema,
  MaterialSpecificationSchema,
} from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { generateMock } from "@anatine/zod-mock";

import { ProductSpecificationActions } from "../../../stores/actions/ProductSpecificationActions.ts";

describe("ProductSpecificationActions.colorSpecificationWithLowestSortIndex", () => {
  it("returns color with the lowest sort index", () => {
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    const colorVariationSpec1 = generateMock(ColorSpecificationSchema);
    const colorVariationSpec2 = generateMock(ColorSpecificationSchema);
    colorVariationSpec1.sortIndex = 0;
    colorVariationSpec2.sortIndex = 2;

    materialSpecMock.colorVariationsSpecs = {
      red1: colorVariationSpec1,
      blue2: colorVariationSpec2,
    };

    const lowestColor =
      ProductSpecificationActions.colorSpecificationWithLowestSortIndex(
        materialSpecMock
      );
    expect(lowestColor).toBe("red1");
  });

  it("returns undefined if there are no color variations", () => {
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    materialSpecMock.colorVariationsSpecs = {};
    const result =
      ProductSpecificationActions.colorSpecificationWithLowestSortIndex(
        materialSpecMock
      );
    expect(result).toBeUndefined();
  });
});
