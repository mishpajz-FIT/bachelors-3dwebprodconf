jest.mock("../../../utilities/Fetching");

import { Catalog } from "@3dwebprodconf/shared/src/schemas/Catalog";
import { CatalogStore } from "../../../stores/CatalogStore";
import { CatalogActions } from "../../../stores/actions/CatalogActions";
import * as FetchingModule from "../../../utilities/Fetching";

const fetchCatalog = FetchingModule.fetchCatalog as jest.Mock;

function createFakeCatalogProduct() {
  return {
    name: "Example Product",
    productSpecificationUrl: "http://example.com/specifications",
    imageUrl: "http://example.com/image",
  };
}

let storeMock: typeof CatalogStore;

beforeEach(() => {
  jest.clearAllMocks();
  storeMock = {
    catalog: undefined,
  };
});

describe("CatalogActions.getCatalog", () => {
  const fallbackUrl = "http://example.com/catalog";

  test("fetches the catalog if not present in the store", async () => {
    const expectedCatalog: Catalog = {
      products: { product1: createFakeCatalogProduct() },
    };
    fetchCatalog.mockResolvedValue(expectedCatalog);

    const catalog = await CatalogActions.getCatalog(fallbackUrl, storeMock);

    expect(fetchCatalog).toHaveBeenCalledWith(fallbackUrl);
    expect(catalog).toEqual(expectedCatalog);
    expect(storeMock.catalog).toBe(expectedCatalog);
  });

  test("returns the existing catalog if already present in the store", async () => {
    const existingCatalog: Catalog = {
      products: { product1: createFakeCatalogProduct() },
    };
    storeMock.catalog = existingCatalog;

    const catalog = await CatalogActions.getCatalog(fallbackUrl, storeMock);

    expect(fetchCatalog).not.toHaveBeenCalled();
    expect(catalog).toBe(existingCatalog);
  });
});
