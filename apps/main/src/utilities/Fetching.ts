import {
  Catalog,
  CatalogSchema,
} from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { fetchParsedJson } from "@3dwebprodconf/shared/src/utilites/Fetching.ts";
import { parseProductSpecification } from "@3dwebprodconf/shared/src/utilites/Parsing.ts";

export async function fetchCatalog(url: string): Promise<Catalog> {
  return fetchParsedJson<Catalog>(url, (data) => CatalogSchema.parse(data));
}

export async function fetchProductSpecification(
  url: string
): Promise<ProductSpecification> {
  return fetchParsedJson<ProductSpecification>(url, (data) =>
    parseProductSpecification(data)
  );
}
