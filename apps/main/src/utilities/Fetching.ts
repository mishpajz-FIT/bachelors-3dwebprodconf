import {
  Catalogue,
  CatalogueSchema,
} from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";
import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { fetchParsedJson } from "@3dwebprodconf/shared/src/utilites/Fetching.ts";
import { parseProductSpecification } from "@3dwebprodconf/shared/src/utilites/Parsing.ts";

export async function fetchCatalogue(url: string): Promise<Catalogue> {
  return fetchParsedJson<Catalogue>(url, (data) => CatalogueSchema.parse(data));
}

export async function fetchProductSpecification(
  url: string
): Promise<ProductSpecification> {
  return fetchParsedJson<ProductSpecification>(url, (data) =>
    parseProductSpecification(data)
  );
}
