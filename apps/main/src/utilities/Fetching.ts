import {
  Catalogue,
  CatalogueSchema,
} from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";
import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { parseProductSpecification } from "@3dwebprodconf/shared/src/utilites/parseProductSpecification.ts";
import { fetchParsedJson } from "@3dwebprodconf/shared/src/utilites/Fetching.ts";

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
