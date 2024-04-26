import { ProductSpecificationStore } from "../../../stores/ProductSpecificationStore.ts";
import { generateMock } from "@anatine/zod-mock";
import {
  ColorSpecificationSchema,
  ComponentSpecificationSchema,
  MaterialSpecificationSchema,
  ProductSpecificationSchema,
} from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { ProductSpecificationActions } from "../../../stores/actions/ProductSpecificationActions.ts";

let storeMock: ProductSpecificationStore;

beforeEach(() => {
  jest.clearAllMocks();
  storeMock = {
    baseSpecs: {},
    componentSpecs: {},
  };
});

describe("ProductSpecificationActions.getComponentSpec", () => {
  it("should return the component specification if it exists", () => {
    const componentSpecId = "comp1";
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    storeMock.componentSpecs[componentSpecId] = componentSpecMock;

    const spec = ProductSpecificationActions.getComponentSpec(
      componentSpecId,
      storeMock
    );
    expect(spec).toEqual(componentSpecMock);
  });

  it("should throw an error if the component specification does not exist", () => {
    expect(() => {
      ProductSpecificationActions.getComponentSpec("nonExistentId", storeMock);
    }).toThrow();
  });

  describe("ProductSpecificationActions.colorSpecificationWithLowestSortIndex", () => {
    it("should return the color id with the lowest sort index", () => {
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

    it("should return undefined if there are no color variations", () => {
      const materialSpecMock = generateMock(MaterialSpecificationSchema);
      materialSpecMock.colorVariationsSpecs = {};
      const result =
        ProductSpecificationActions.colorSpecificationWithLowestSortIndex(
          materialSpecMock
        );
      expect(result).toBeUndefined();
    });
  });

  describe("ProductSpecificationActions.storeProductSpecification", () => {
    it("should store product specifications into the store", () => {
      const oldProductSpecMock = generateMock(ProductSpecificationSchema);
      storeMock.componentSpecs = oldProductSpecMock.componentSpecs;
      storeMock.baseSpecs = oldProductSpecMock.baseSpecs;

      const productSpecMock = generateMock(ProductSpecificationSchema);

      ProductSpecificationActions.storeProductSpecification(
        productSpecMock,
        storeMock
      );

      expect(storeMock.componentSpecs).toEqual(productSpecMock.componentSpecs);
      expect(storeMock.baseSpecs).toEqual(productSpecMock.baseSpecs);
    });
  });
});
