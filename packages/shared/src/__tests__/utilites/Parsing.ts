import { generateMock } from "@anatine/zod-mock";

import {
  ComponentSpecificationSchema,
  MaterialSpecificationSchema,
  ProductSpecification,
} from "../../schemas/ProductSpecification.ts";
import { GenericProductSpecificationActions } from "../../stores/actions/GenericProductSpecificationActions.ts";
import { parseProductSpecification } from "../../utilites/Parsing.ts";

jest.mock("i18next", () => ({
  t: jest.fn().mockImplementation((key, params) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return params ? `${key} with params ${JSON.stringify(params)}` : key;
  }),
}));

jest.mock("../../stores/actions/GenericProductSpecificationActions");

const validateMountingPoints =
  // eslint-disable-next-line @typescript-eslint/unbound-method
  GenericProductSpecificationActions.validateMountingPoints as jest.Mock;
const validateMaterials =
  // eslint-disable-next-line @typescript-eslint/unbound-method
  GenericProductSpecificationActions.validateMaterials as jest.Mock;

let productSpecificationMock: ProductSpecification;

beforeEach(() => {
  productSpecificationMock = {
    baseSpecs: {
      base: "base",
    },
    componentSpecs: {
      base: generateMock(ComponentSpecificationSchema),
    },
  };
  productSpecificationMock.componentSpecs.base.materialSpecs = {
    mat1: generateMock(MaterialSpecificationSchema),
  };
  productSpecificationMock.componentSpecs.base.materialSpecs.mat1.colorVariationsSpecs =
    {
      no1: {
        value: "#123456",
        name: "test color",
        sortIndex: 0,
      },
    };
});

describe("parseProductSpecification", () => {
  it("parses product specification", () => {
    validateMaterials.mockReturnValue({});
    validateMountingPoints.mockReturnValue({});

    const result = parseProductSpecification(productSpecificationMock);
    expect(result).toEqual(productSpecificationMock);
  });

  it("throws an error if a component spec in baseSpecs is missing", () => {
    productSpecificationMock.baseSpecs = {
      "non-existing": "non-existing-component",
    };
    validateMaterials.mockReturnValue({});
    validateMountingPoints.mockReturnValue({});

    expect(() => parseProductSpecification(productSpecificationMock)).toThrow(
      'errorMissingComponentSpec with params {"componentSpecId":"non-existing-component"}'
    );
  });

  it("throws an error if there are mounting points with no mountable components", () => {
    validateMaterials.mockReturnValue({});
    validateMountingPoints.mockReturnValue({ comp1: ["mp1"] });

    expect(() => parseProductSpecification(productSpecificationMock)).toThrow(
      "missingComponentsInMountingPointscomp1: mp1;"
    );
  });

  it("throws an error if there are materials with no colors", () => {
    validateMaterials.mockReturnValue({ comp1: ["mat1"] });
    validateMountingPoints.mockReturnValue({});

    expect(() => parseProductSpecification(productSpecificationMock)).toThrow(
      "missingColorsInMaterialscomp1: mat1;"
    );
  });
});
