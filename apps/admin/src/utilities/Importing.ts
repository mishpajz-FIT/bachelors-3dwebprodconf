import {
  Catalog,
  CatalogSchema,
} from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { readParsedJsonFromFile } from "@3dwebprodconf/shared/src/utilites/Importing.ts";
import { parseProductSpecification } from "@3dwebprodconf/shared/src/utilites/Parsing.ts";

export function readCatalogFromFile(file: File): Promise<Catalog> {
  return readParsedJsonFromFile(file, (data: unknown) =>
    CatalogSchema.parse(data)
  );
}

export function readProductSpecificationFromFile(
  file: File
): Promise<ProductSpecification> {
  return readParsedJsonFromFile(file, (data: unknown) =>
    parseProductSpecification(data)
  );
}
