jest.mock("../../../utilities/Fetching");

import {
  Catalog,
  CatalogSchema,
} from "@3dwebprodconf/shared/src/schemas/Catalog";
import { generateMock } from "@anatine/zod-mock";

import { CatalogActions } from "../../../stores/actions/CatalogActions";
import { CatalogStore } from "../../../stores/CatalogStore";
import * as FetchingModule from "../../../utilities/Fetching";

const fetchCatalog = FetchingModule.fetchCatalog as jest.Mock;

let storeMock: CatalogStore;

beforeEach(() => {
  jest.clearAllMocks();
  storeMock = {
    catalog: undefined,
  };
});

describe("CatalogActions.getCatalog", () => {
  const fallbackUrl = "http://example.com/catalog";

  test("fetches and returns the catalog if not present in the store", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
    const expectedCatalog = generateMock(CatalogSchema);
    fetchCatalog.mockResolvedValue(expectedCatalog);
    const catalog = await CatalogActions.getCatalog(fallbackUrl, storeMock);

    expect(fetchCatalog).toHaveBeenCalledWith(fallbackUrl);
    expect(catalog).toEqual(expectedCatalog);
    expect(storeMock.catalog).toBe(expectedCatalog);
  });

  test("returns the existing catalog if already present in the store", async () => {
    const existingCatalog: Catalog = generateMock(CatalogSchema);
    storeMock.catalog = existingCatalog;

    const catalog = await CatalogActions.getCatalog(fallbackUrl, storeMock);

    expect(fetchCatalog).not.toHaveBeenCalled();
    expect(catalog).toBe(existingCatalog);
  });
});
