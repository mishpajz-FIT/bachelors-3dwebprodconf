import {
  ColorSpecificationSchema,
  ComponentSpecificationSchema,
  MaterialSpecificationSchema,
  MountingPointSpecificationSchema,
} from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { UserComponentSchema } from "@3dwebprodconf/shared/src/schemas/UserCreation.ts";
import { generateMock } from "@anatine/zod-mock";
import { v4 } from "uuid";

import { ProductSpecificationActions } from "../../../stores/actions/ProductSpecificationActions";
import { UserCreationActions } from "../../../stores/actions/UserCreationActions.ts";
import { ProductSpecificationStore } from "../../../stores/ProductSpecificationStore.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";

jest.mock("i18next", () => ({
  t: jest.fn().mockImplementation((key, params) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return params ? `${key} with params ${JSON.stringify(params)}` : key;
  }),
}));

jest.mock("uuid", () => ({ v4: jest.fn() }));
jest.mock("../../../stores/actions/ProductSpecificationActions");

let storeMock: UserCreationStore;
let productSpecificationStoreMock: ProductSpecificationStore;

const getComponentSpec =
  // eslint-disable-next-line @typescript-eslint/unbound-method
  ProductSpecificationActions.getComponentSpec as jest.Mock;
const getMaterialSpec =
  // eslint-disable-next-line @typescript-eslint/unbound-method
  ProductSpecificationActions.getMaterialSpec as jest.Mock;
const getColorSpec =
  // eslint-disable-next-line @typescript-eslint/unbound-method
  ProductSpecificationActions.getColorSpec as jest.Mock;
const colorSpecificationWithLowestSortIndex =
  // eslint-disable-next-line @typescript-eslint/unbound-method
  ProductSpecificationActions.colorSpecificationWithLowestSortIndex as jest.Mock;
const uuid = v4 as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  storeMock = {
    product: "",
    base: "",
    components: {},
    childToParentMap: {},
    isBaseSet: false,
  };
  productSpecificationStoreMock = {
    baseSpecs: {},
    componentSpecs: {},
  };
});

describe("UserCreationActions.getComponent", () => {
  it("should throw an error if the component does not exist", () => {
    const componentId = "nonExistentComponent";
    expect(() =>
      UserCreationActions.getComponent(componentId, storeMock)
    ).toThrow(
      'errorMissingComponent with params {"componentId":"nonExistentComponent"}'
    );
  });

  it("should return the component if it exists", () => {
    const componentId = "existentComponent";
    const componentData = generateMock(UserComponentSchema);
    storeMock.components[componentId] = componentData;

    expect(UserCreationActions.getComponent(componentId, storeMock)).toEqual(
      componentData
    );
  });
});

describe("UserCreationActions.createComponent", () => {
  it("return id of created component with the lowest color specification", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    const colorSpecMock = generateMock(ColorSpecificationSchema);
    materialSpecMock.colorVariationsSpecs = { col1: colorSpecMock };
    componentSpecMock.materialSpecs = { mat1: materialSpecMock };
    productSpecificationStoreMock.componentSpecs.comp1 = componentSpecMock;
    getComponentSpec.mockReturnValue(componentSpecMock);
    getMaterialSpec.mockReturnValue(materialSpecMock);
    colorSpecificationWithLowestSortIndex.mockReturnValue("col1");
    const mockNewComponentId = "0new_comp0";
    uuid.mockReturnValue(mockNewComponentId);

    const componentId = UserCreationActions.createComponent(
      "comp1",
      storeMock,
      productSpecificationStoreMock
    );

    expect(componentId).toEqual(mockNewComponentId);
    expect(storeMock.components[componentId]).toEqual({
      componentSpec: "comp1",
      materials: { mat1: "col1" },
      mounted: {},
    });
    expect(getComponentSpec).toHaveBeenCalledWith(
      "comp1",
      productSpecificationStoreMock
    );
    expect(getMaterialSpec).toHaveBeenCalledWith(componentSpecMock, "mat1");
    expect(colorSpecificationWithLowestSortIndex).toHaveBeenCalledWith(
      materialSpecMock
    );
  });

  it("return id of created component even if no material is available", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    componentSpecMock.materialSpecs = {};
    colorSpecificationWithLowestSortIndex.mockReturnValue(undefined);
    const mockNewComponentId = "0new_comp0";
    uuid.mockReturnValue(mockNewComponentId);
    productSpecificationStoreMock.componentSpecs.comp1 = componentSpecMock;

    const componentId = UserCreationActions.createComponent(
      "comp1",
      storeMock,
      productSpecificationStoreMock
    );

    expect(storeMock.components[componentId]).toEqual({
      componentSpec: "comp1",
      materials: {},
      mounted: {},
    });
  });

  it("return id of created component even if no color is available", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    materialSpecMock.colorVariationsSpecs = {};
    componentSpecMock.materialSpecs = { mat1: materialSpecMock };
    productSpecificationStoreMock.componentSpecs.comp1 = componentSpecMock;
    getComponentSpec.mockReturnValue(componentSpecMock);
    getMaterialSpec.mockReturnValue(materialSpecMock);
    colorSpecificationWithLowestSortIndex.mockReturnValue(undefined);
    const mockNewComponentId = "0new_comp0";
    uuid.mockReturnValue(mockNewComponentId);

    const componentId = UserCreationActions.createComponent(
      "comp1",
      storeMock,
      productSpecificationStoreMock
    );

    expect(componentId).toEqual(mockNewComponentId);
    expect(storeMock.components[componentId]).toEqual({
      componentSpec: "comp1",
      materials: {},
      mounted: {},
    });
    expect(getComponentSpec).toHaveBeenCalledWith(
      "comp1",
      productSpecificationStoreMock
    );
    expect(getMaterialSpec).toHaveBeenCalledWith(componentSpecMock, "mat1");
    expect(colorSpecificationWithLowestSortIndex).toHaveBeenCalledWith(
      materialSpecMock
    );
  });
});

describe("UserCreationActions.unmountComponent", () => {
  it("removes the mounted component from the mounting point", () => {
    const componentMock1 = generateMock(UserComponentSchema);
    const componentMock2 = generateMock(UserComponentSchema);
    const componentMock3 = generateMock(UserComponentSchema);
    componentMock3.mounted = {};
    componentMock2.mounted = {
      mp1: "cm3",
    };
    componentMock1.mounted = {
      mp2: "cm2",
    };

    storeMock.components.cm1 = componentMock1;
    storeMock.components.cm2 = componentMock2;
    storeMock.components.cm3 = componentMock3;
    storeMock.childToParentMap.cm2 = ["cm1", "mp2"];
    storeMock.childToParentMap.cm3 = ["cm2", "mp1"];

    UserCreationActions.unmountComponent("cm1", "mp2", storeMock);

    expect(storeMock.components.cm1.mounted.mp2).toBeUndefined();
    expect(storeMock.components.cm2.mounted.mp1).toBe("cm3");
    expect(storeMock.childToParentMap.cm2).toBeUndefined();
  });

  it("does nothing when no component is mounted", () => {
    const componentMock = generateMock(UserComponentSchema);
    componentMock.mounted = {};

    storeMock.components.cm = componentMock;

    UserCreationActions.unmountComponent("cm", "mp1", storeMock);

    expect(storeMock.components.cm.mounted).toEqual({});
  });

  it("throws when the component does not exist", () => {
    expect(() =>
      UserCreationActions.unmountComponent("cm", "mp1", storeMock)
    ).toThrow('errorMissingComponent with params {"componentId":"cm"}');
  });
});

describe("UserCreationActions.removeComponent", () => {
  it("removes and unmounts the component", () => {
    const componentMock1 = generateMock(UserComponentSchema);
    const componentMock2 = generateMock(UserComponentSchema);
    const componentMock3 = generateMock(UserComponentSchema);
    componentMock3.mounted = {};
    componentMock2.mounted = {
      mp1: "cm3",
    };
    componentMock1.mounted = {
      mp2: "cm2",
    };

    storeMock.components.cm1 = componentMock1;
    storeMock.components.cm2 = componentMock2;
    storeMock.components.cm3 = componentMock3;
    storeMock.childToParentMap.cm2 = ["cm1", "mp2"];
    storeMock.childToParentMap.cm3 = ["cm2", "mp1"];

    UserCreationActions.removeComponent("cm2", storeMock);

    expect(storeMock.components).toEqual({
      cm1: {
        ...componentMock1,
        mounted: {},
      },
    });
    expect(Object.keys(storeMock.childToParentMap)).toHaveLength(0);
  });

  it("throws when the component does not exist", () => {
    expect(() => UserCreationActions.removeComponent("cm", storeMock)).toThrow(
      'errorMissingComponent with params {"componentId":"cm"}'
    );
  });
});

describe("UserCreationActions.mountComponent", () => {
  it("throws if there is cycle", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const mountingPointSpecMock = generateMock(
      MountingPointSpecificationSchema
    );
    componentSpecMock.mountingPointsSpecs = { mp1: mountingPointSpecMock };
    productSpecificationStoreMock.componentSpecs = { comp1: componentSpecMock };
    const componentMock1 = generateMock(UserComponentSchema);
    componentMock1.componentSpec = "comp1";
    const componentMock2 = generateMock(UserComponentSchema);
    componentMock2.componentSpec = "comp1";
    const componentMock3 = generateMock(UserComponentSchema);
    componentMock3.componentSpec = "comp1";
    componentMock3.mounted = {};
    componentMock2.mounted = {
      mp1: "cm3",
    };
    componentMock1.mounted = {
      mp1: "cm2",
    };

    storeMock.components.cm1 = componentMock1;
    storeMock.components.cm2 = componentMock2;
    storeMock.components.cm3 = componentMock3;
    storeMock.childToParentMap.cm2 = ["cm1", "mp1"];
    storeMock.childToParentMap.cm3 = ["cm2", "mp1"];

    expect(() => {
      UserCreationActions.mountComponent(
        "cm3",
        "mp1",
        "cm1",
        storeMock,
        productSpecificationStoreMock
      );
    }).toThrow("errorComponentMountingCycle");
  });

  it("throws if the component does not exist", () => {
    expect(() => UserCreationActions.removeComponent("cm", storeMock)).toThrow(
      'errorMissingComponent with params {"componentId":"cm"}'
    );
  });

  it("mounts the component", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const mountingPointSpecMock = generateMock(
      MountingPointSpecificationSchema
    );
    componentSpecMock.mountingPointsSpecs = { mp1: mountingPointSpecMock };
    productSpecificationStoreMock.componentSpecs = { comp1: componentSpecMock };
    const componentMock1 = generateMock(UserComponentSchema);
    componentMock1.componentSpec = "comp1";
    const componentMock2 = generateMock(UserComponentSchema);
    componentMock2.componentSpec = "comp1";
    componentMock2.mounted = {};
    componentMock1.mounted = {};

    storeMock.components.cm1 = componentMock1;
    storeMock.components.cm2 = componentMock2;

    UserCreationActions.mountComponent(
      "cm1",
      "mp1",
      "cm2",
      storeMock,
      productSpecificationStoreMock
    );

    expect(storeMock.components.cm1.mounted.mp1).toBe("cm2");
    expect(storeMock.childToParentMap.cm2).toEqual(["cm1", "mp1"]);
  });

  it("removes mounted components and mounts component", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const mountingPointSpecMock = generateMock(
      MountingPointSpecificationSchema
    );
    componentSpecMock.mountingPointsSpecs = { mp1: mountingPointSpecMock };
    productSpecificationStoreMock.componentSpecs = { comp1: componentSpecMock };
    const componentMock1 = generateMock(UserComponentSchema);
    componentMock1.componentSpec = "comp1";
    const componentMock2 = generateMock(UserComponentSchema);
    componentMock2.componentSpec = "comp1";
    const componentMock3 = generateMock(UserComponentSchema);
    componentMock3.componentSpec = "comp1";
    const componentMock4 = generateMock(UserComponentSchema);
    componentMock4.componentSpec = "comp1";
    componentMock4.mounted = {};
    componentMock3.mounted = {};
    componentMock2.mounted = {
      mp1: "cm3",
    };
    componentMock1.mounted = {
      mp1: "cm2",
    };

    storeMock.components.cm1 = componentMock1;
    storeMock.components.cm2 = componentMock2;
    storeMock.components.cm3 = componentMock3;
    storeMock.components.cm4 = componentMock4;
    storeMock.childToParentMap.cm2 = ["cm1", "mp1"];
    storeMock.childToParentMap.cm3 = ["cm2", "mp1"];

    UserCreationActions.mountComponent(
      "cm1",
      "mp1",
      "cm4",
      storeMock,
      productSpecificationStoreMock
    );

    expect(storeMock.components.cm1.mounted.mp1).toBe("cm4");
    expect(storeMock.childToParentMap.cm4).toEqual(["cm1", "mp1"]);

    expect(Object.keys(storeMock.components)).toHaveLength(2);
    expect(Object.keys(storeMock.childToParentMap)).toHaveLength(1);
  });
});

describe("UserCreationActions.removeAllNonbaseComponents", () => {
  it("removes and unmounts all nonbase components", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const mountingPointSpecMock = generateMock(
      MountingPointSpecificationSchema
    );
    componentSpecMock.mountingPointsSpecs = { mp1: mountingPointSpecMock };
    productSpecificationStoreMock.componentSpecs = { comp1: componentSpecMock };
    const componentMock1 = generateMock(UserComponentSchema);
    componentMock1.componentSpec = "comp1";
    const componentMock2 = generateMock(UserComponentSchema);
    componentMock2.componentSpec = "comp1";
    const componentMock3 = generateMock(UserComponentSchema);
    componentMock3.componentSpec = "comp1";
    componentMock3.mounted = {};
    componentMock2.mounted = {
      mp1: "cm3",
    };
    componentMock1.mounted = {
      mp1: "cm2",
    };

    storeMock.base = "cm1";
    storeMock.isBaseSet = true;

    storeMock.components.cm1 = componentMock1;
    storeMock.components.cm2 = componentMock2;
    storeMock.components.cm3 = componentMock3;
    storeMock.childToParentMap.cm2 = ["cm1", "mp1"];
    storeMock.childToParentMap.cm3 = ["cm2", "mp1"];

    UserCreationActions.removeAllNonbaseComponents(storeMock);

    expect(storeMock.childToParentMap).toEqual({});
    expect(storeMock.components).toEqual({
      cm1: {
        ...componentMock1,
        mounted: {},
      },
    });
  });

  it("removes and unmounts all components if base is not set", () => {
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const mountingPointSpecMock = generateMock(
      MountingPointSpecificationSchema
    );
    componentSpecMock.mountingPointsSpecs = { mp1: mountingPointSpecMock };
    productSpecificationStoreMock.componentSpecs = { comp1: componentSpecMock };
    const componentMock1 = generateMock(UserComponentSchema);
    componentMock1.componentSpec = "comp1";
    const componentMock2 = generateMock(UserComponentSchema);
    componentMock2.componentSpec = "comp1";
    const componentMock3 = generateMock(UserComponentSchema);
    componentMock3.componentSpec = "comp1";
    componentMock3.mounted = {};
    componentMock2.mounted = {
      mp1: "cm3",
    };
    componentMock1.mounted = {
      mp1: "cm2",
    };

    storeMock.base = "";
    storeMock.isBaseSet = false;
    storeMock.components.cm1 = componentMock1;
    storeMock.components.cm2 = componentMock2;
    storeMock.components.cm3 = componentMock3;
    storeMock.childToParentMap.cm2 = ["cm1", "mp1"];
    storeMock.childToParentMap.cm3 = ["cm2", "mp1"];

    UserCreationActions.removeAllNonbaseComponents(storeMock);

    expect(storeMock.childToParentMap).toEqual({});
    expect(storeMock.components).toEqual({});
  });
});

describe("UserCreationActions.setBase", () => {
  it("throws if component does not exist", () => {
    expect(() => UserCreationActions.getComponent("comp", storeMock)).toThrow(
      'errorMissingComponent with params {"componentId":"comp"}'
    );
  });

  it("sets the base component and removes others", () => {
    const componentMock1 = generateMock(UserComponentSchema);
    const componentMock2 = generateMock(UserComponentSchema);
    const componentMock3 = generateMock(UserComponentSchema);
    componentMock3.mounted = {};
    componentMock2.mounted = {
      mp1: "cm3",
    };
    componentMock1.mounted = {
      mp1: "cm2",
    };
    storeMock.base = "";
    storeMock.isBaseSet = false;
    storeMock.components.cm1 = componentMock1;
    storeMock.components.cm2 = componentMock2;
    storeMock.components.cm3 = componentMock3;
    storeMock.childToParentMap.cm2 = ["cm1", "mp1"];
    storeMock.childToParentMap.cm3 = ["cm2", "mp1"];

    UserCreationActions.setBase("cm1", storeMock);

    expect(storeMock.childToParentMap).toEqual({});
    expect(storeMock.components).toEqual({
      cm1: { ...componentMock1, mounted: {} },
    });
    expect(storeMock.isBaseSet).toBe(true);
    expect(storeMock.base).toBe("cm1");
  });
});

describe("UserCreationActions.changeMaterialColor", () => {
  it("should change color of material", () => {
    const componentMock = generateMock(UserComponentSchema);
    componentMock.materials = { mat1: "col2" };
    storeMock.components.cm1 = componentMock;
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    const colorSpecMock = generateMock(ColorSpecificationSchema);
    materialSpecMock.colorVariationsSpecs = {
      col1: colorSpecMock,
      col2: colorSpecMock,
    };
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    componentSpecMock.materialSpecs = { mat1: materialSpecMock };
    productSpecificationStoreMock.componentSpecs.comp1 = componentSpecMock;
    getComponentSpec.mockReturnValue(componentSpecMock);
    getMaterialSpec.mockReturnValue(materialSpecMock);
    getColorSpec.mockReturnValue(colorSpecMock);

    UserCreationActions.changeMaterialColor(
      "cm1",
      "mat1",
      "col1",
      storeMock,
      productSpecificationStoreMock
    );

    expect(storeMock.components.cm1.materials.mat1).toBe("col1");
    expect(colorSpecificationWithLowestSortIndex).not.toHaveBeenCalled();
  });

  it("should change color of material to default one if no material provided", () => {
    const componentMock = generateMock(UserComponentSchema);
    componentMock.materials = { mat1: "col2" };
    storeMock.components.cm1 = componentMock;
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    const colorSpecMock = generateMock(ColorSpecificationSchema);
    materialSpecMock.colorVariationsSpecs = {
      col1: colorSpecMock,
      col2: colorSpecMock,
    };
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    componentSpecMock.materialSpecs = { mat1: materialSpecMock };
    productSpecificationStoreMock.componentSpecs.comp1 = componentSpecMock;
    getComponentSpec.mockReturnValue(componentSpecMock);
    getMaterialSpec.mockReturnValue(materialSpecMock);
    colorSpecificationWithLowestSortIndex.mockReturnValue("col1");
    getColorSpec.mockReturnValue(colorSpecMock);

    UserCreationActions.changeMaterialColor(
      "cm1",
      "mat1",
      undefined,
      storeMock,
      productSpecificationStoreMock
    );

    expect(storeMock.components.cm1.materials.mat1).toBe("col1");
    expect(colorSpecificationWithLowestSortIndex).toHaveBeenCalled();
  });

  it("should throw if default color does not exist", () => {
    const componentMock = generateMock(UserComponentSchema);
    componentMock.materials = { mat1: "col2" };
    storeMock.components.cm1 = componentMock;
    const materialSpecMock = generateMock(MaterialSpecificationSchema);
    const colorSpecMock = generateMock(ColorSpecificationSchema);
    materialSpecMock.colorVariationsSpecs = { col1: colorSpecMock };
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    componentSpecMock.materialSpecs = { mat1: materialSpecMock };
    productSpecificationStoreMock.componentSpecs.comp1 = componentSpecMock;
    getComponentSpec.mockReturnValue(componentSpecMock);
    getMaterialSpec.mockReturnValue(materialSpecMock);
    colorSpecificationWithLowestSortIndex.mockReturnValue(undefined);

    expect(() => {
      UserCreationActions.changeMaterialColor(
        "cm1",
        "mat1",
        undefined,
        storeMock,
        productSpecificationStoreMock
      );
    }).toThrow(
      'errorNoColorVariationOnMaterial with params {"materialSpecId":"mat1","componentId":"cm1"}'
    );
  });
});

describe("UserCreationActions.detectMissingRequired", () => {
  it("should return an empty array when no required mounting points are missing", () => {
    const componentMock1 = generateMock(UserComponentSchema);
    const componentSpecMock = generateMock(ComponentSpecificationSchema);
    const mountingPointSpecMock = generateMock(
      MountingPointSpecificationSchema
    );
    mountingPointSpecMock.isRequired = false;
    componentMock1.mounted = {};
    componentSpecMock.mountingPointsSpecs = { mp1: mountingPointSpecMock };
    productSpecificationStoreMock.componentSpecs = { comp1: componentSpecMock };
    storeMock.components = { cm1: componentMock1 };
    componentMock1.componentSpec = "comp1";

    expect(
      UserCreationActions.detectMissingRequired(
        storeMock,
        productSpecificationStoreMock
      )
    ).toEqual([]);
  });

  it("should return an array of components where required mounting points are missing", () => {
    const componentMock1 = generateMock(UserComponentSchema);
    const componentMock2 = generateMock(UserComponentSchema);
    const componentMock3 = generateMock(UserComponentSchema);
    const componentSpecMock1 = generateMock(ComponentSpecificationSchema);
    const componentSpecMock2 = generateMock(ComponentSpecificationSchema);
    const mountingPointSpecMock1 = generateMock(
      MountingPointSpecificationSchema
    );
    mountingPointSpecMock1.isRequired = true;
    const mountingPointSpecMock2 = generateMock(
      MountingPointSpecificationSchema
    );
    mountingPointSpecMock2.isRequired = false;
    componentMock1.mounted = {};
    componentMock2.mounted = {};
    componentMock3.mounted = {};
    componentSpecMock1.mountingPointsSpecs = {
      mp1: mountingPointSpecMock1,
      mp2: mountingPointSpecMock2,
    };
    componentSpecMock2.mountingPointsSpecs = { mp3: mountingPointSpecMock2 };
    productSpecificationStoreMock.componentSpecs = {
      comp1: componentSpecMock1,
      comp2: componentSpecMock2,
    };
    componentMock1.componentSpec = "comp1";
    componentMock2.componentSpec = "comp2";
    componentMock3.componentSpec = "comp1";
    storeMock.components = {
      cm1: componentMock1,
      cm2: componentMock2,
      cm3: componentMock3,
    };
    getComponentSpec.mockImplementation(
      (id: string, store: ProductSpecificationStore) => store.componentSpecs[id]
    );

    expect(
      UserCreationActions.detectMissingRequired(
        storeMock,
        productSpecificationStoreMock
      )
    ).toEqual(["cm1", "cm3"]);
  });
});
