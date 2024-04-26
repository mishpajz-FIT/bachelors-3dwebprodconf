import { generateMock } from "@anatine/zod-mock";

jest.mock("i18next", () => ({
  t: jest
    .fn()
    .mockImplementation(
      (key, params) => `${key} with params ${JSON.stringify(params)}`
    ),
}));

import { CatalogStore } from "../../../stores/CatalogStore.ts";
import { UserCreationActions } from "../../../stores/actions/UserCreationActions.ts";
import { UserCreationStore } from "../../../stores/UserCreationStore.ts";
import { UserComponentSchema } from "@3dwebprodconf/shared/src/schemas/UserCreation.ts";

beforeEach(() => {
  jest.clearAllMocks();
  storeMock = {
    value: {
      components: {},
      childToParentMap: {},
      base: "",
      isBaseSet: false,
    },
  };
});

describe("UserCreationActions.getComponent", () => {
  it("should throw an error if the component does not exist", () => {
    const componentId = "nonExistentComponent";
    expect(() =>
      // @ts-ignore
      UserCreationActions.getComponent(componentId, storeMock)
    ).toThrow(
      'errorMissingComponent with params {"componentId":"nonExistentComponent"}'
    );
  });

  it("should return the component if it exists", () => {
    const componentId = "existentComponent";
    const componentData = generateMock(UserComponentSchema);
    storeMock.value.components[componentId] = componentData;

    // @ts-ignore
    expect(UserCreationActions.getComponent(componentId, storeMock)).toEqual(
      componentData
    );
  });
});
