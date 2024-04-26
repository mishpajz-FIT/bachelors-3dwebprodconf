import { generateMock } from "@anatine/zod-mock";
import { ProductSpecificationStore } from "main/src/stores/ProductSpecificationStore.ts";

import {
  ColorSpecificationSchema,
  ComponentSpecificationSchema,
  MaterialSpecificationSchema,
  MountingPointSpecificationSchema,
  ProductSpecificationSchema,
} from "../../../schemas/ProductSpecification.ts";
import { GenericProductSpecificationActions } from "../../../stores/actions/GenericProductSpecificationActions.ts";

let storeMock: ProductSpecificationStore;

beforeEach(() => {
  jest.clearAllMocks();
  storeMock = {
    baseSpecs: {},
    componentSpecs: {},
  };
});

describe("GenericProductSpecificationActions.getComponentSpec", () => {
  it("returns the component specification if it exists", () => {
    const componentSpecId = "comp1";
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    storeMock.componentSpecs[componentSpecId] = componentSpecMock;

    const spec = GenericProductSpecificationActions.getComponentSpec(
      componentSpecId,
      storeMock
    );
    expect(spec).toEqual(componentSpecMock);
  });

  it("throws an error if the component specification does not exist", () => {
    expect(() => {
      GenericProductSpecificationActions.getComponentSpec(
        "nonExistentId",
        storeMock
      );
    }).toThrow();
  });
});

describe("GenericProductSpecificationActions.getMountingPointSpec", () => {
  it("returns the mounting point specification if it exists", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const mountingPointSpecMock = generateMock(
      MountingPointSpecificationSchema
    );
    componentSpecMock.mountingPointsSpecs = { mp1: mountingPointSpecMock };

    const spec = GenericProductSpecificationActions.getMountingPointSpec(
      componentSpecMock,
      "mp1"
    );
    expect(spec).toEqual(mountingPointSpecMock);
  });

  it("throws an error if the mounting point specification does not exist", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    componentSpecMock.mountingPointsSpecs = {};

    expect(() => {
      GenericProductSpecificationActions.getMountingPointSpec(
        componentSpecMock,
        "nonExistentId"
      );
    }).toThrow();
  });
});

describe("GenericProductSpecificationActions.getMaterialSpec", () => {
  it("returns the material specification if it exists", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    componentSpecMock.materialSpecs = { ma1: materialSpecMock };

    const spec = GenericProductSpecificationActions.getMaterialSpec(
      componentSpecMock,
      "ma1"
    );
    expect(spec).toEqual(materialSpecMock);
  });

  it("throws an error if the material specification does not exist", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    componentSpecMock.materialSpecs = {};

    expect(() => {
      GenericProductSpecificationActions.getMaterialSpec(
        componentSpecMock,
        "nonExistentId"
      );
    }).toThrow();
  });
});

describe("GenericProductSpecificationActions.getColorSpec", () => {
  it("returns the color specification if it exists", () => {
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    const colorSpecMock = generateMock(ColorSpecificationSchema);
    materialSpecMock.colorVariationsSpecs = { c1: colorSpecMock };

    const spec = GenericProductSpecificationActions.getColorSpec(
      materialSpecMock,
      "c1"
    );
    expect(spec).toEqual(colorSpecMock);
  });

  it("throws an error if the color specification does not exist", () => {
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    materialSpecMock.colorVariationsSpecs = {};

    expect(() => {
      GenericProductSpecificationActions.getColorSpec(materialSpecMock, "c1");
    }).toThrow();
  });
});

describe("GenericProductSpecificationActions.removeComponentSpec", () => {
  it("remove the component specification and all its links if it exists", () => {
    const componentSpecId = "comp1";
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    storeMock.componentSpecs[componentSpecId] = componentSpecMock;
    const componentSpecMock2 = generateMock(ComponentSpecificationSchema);
    const mouningPointSpecificationMock = generateMock(
      MountingPointSpecificationSchema
    );
    mouningPointSpecificationMock.mountableComponents = [componentSpecId];
    componentSpecMock2.mountingPointsSpecs = {
      mp1: mouningPointSpecificationMock,
    };
    storeMock.componentSpecs.comp2 = componentSpecMock2;
    storeMock.baseSpecs.a = componentSpecId;

    GenericProductSpecificationActions.removeComponentSpec(
      componentSpecId,
      storeMock
    );
    expect(storeMock.baseSpecs.a).toBeUndefined();
    expect(storeMock.componentSpecs[componentSpecId]).toBeUndefined();
    expect(
      storeMock.componentSpecs.comp2.mountingPointsSpecs.mp1.mountableComponents
    ).toEqual([]);
  });
});

describe("GenericProductSpecification.validateMountingPoints", () => {
  it("returns components with mounting points without mountable components", () => {
    const componentSpecMock1 = generateMock(ComponentSpecificationSchema);
    const componentSpecMock2 = generateMock(ComponentSpecificationSchema);
    const componentSpecMock3 = generateMock(ComponentSpecificationSchema);
    const mountingPointSpecMock1 = generateMock(
      MountingPointSpecificationSchema
    );
    const mountingPointSpecMock2 = generateMock(
      MountingPointSpecificationSchema
    );
    mountingPointSpecMock1.mountableComponents = [];
    mountingPointSpecMock2.mountableComponents = ["test"];
    componentSpecMock1.mountingPointsSpecs = { "1y": mountingPointSpecMock1 };
    componentSpecMock2.mountingPointsSpecs = { "2n": mountingPointSpecMock2 };
    componentSpecMock3.mountingPointsSpecs = { "3y": mountingPointSpecMock1 };
    storeMock.componentSpecs = {
      cm1: componentSpecMock1,
      cm2: componentSpecMock2,
      cm3: componentSpecMock3,
    };
    expect(
      GenericProductSpecificationActions.validateMountingPoints(
        storeMock.componentSpecs
      )
    ).toEqual({ cm1: ["1y"], cm3: ["3y"] });
  });
});

describe("GenericProductSpecification.validateMaterials", () => {
  it("returns components with mounting points without mountable components", () => {
    const componentSpecMock1 = generateMock(ComponentSpecificationSchema);
    const componentSpecMock2 = generateMock(ComponentSpecificationSchema);
    const componentSpecMock3 = generateMock(ComponentSpecificationSchema);
    const materialSpecMock1 = generateMock(MaterialSpecificationSchema);
    const materialSpecMock2 = generateMock(MaterialSpecificationSchema);
    materialSpecMock1.colorVariationsSpecs = {};
    materialSpecMock2.colorVariationsSpecs = {
      test: generateMock(ColorSpecificationSchema),
    };
    componentSpecMock1.materialSpecs = { "1y": materialSpecMock1 };
    componentSpecMock2.materialSpecs = { "2n": materialSpecMock2 };
    componentSpecMock3.materialSpecs = { "3y": materialSpecMock1 };
    storeMock.componentSpecs = {
      cm1: componentSpecMock1,
      cm2: componentSpecMock2,
      cm3: componentSpecMock3,
    };
    expect(
      GenericProductSpecificationActions.validateMaterials(
        storeMock.componentSpecs
      )
    ).toEqual({ cm1: ["1y"], cm3: ["3y"] });
  });
});

describe("GenericProductSpecification.clearProductSpecification", () => {
  it("removes data from the store", () => {
    const oldProductSpecMock = generateMock(ProductSpecificationSchema);
    storeMock.componentSpecs = oldProductSpecMock.componentSpecs;
    storeMock.baseSpecs = oldProductSpecMock.baseSpecs;

    GenericProductSpecificationActions.clearProductSpecification(storeMock);

    expect(storeMock.componentSpecs).toEqual({});
    expect(storeMock.baseSpecs).toEqual({});
  });
});

describe("GenericProductSpecification.storeProductSpecification", () => {
  it("stores product specifications into the store", () => {
    const oldProductSpecMock = generateMock(ProductSpecificationSchema);
    storeMock.componentSpecs = oldProductSpecMock.componentSpecs;
    storeMock.baseSpecs = oldProductSpecMock.baseSpecs;

    const productSpecMock = generateMock(ProductSpecificationSchema);

    GenericProductSpecificationActions.storeProductSpecification(
      productSpecMock,
      storeMock
    );

    expect(storeMock.componentSpecs).toEqual(productSpecMock.componentSpecs);
    expect(storeMock.baseSpecs).toEqual(productSpecMock.baseSpecs);
  });
});
