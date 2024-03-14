import {
  Catalogue,
  CatalogueSchema,
} from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";
import { ProductSpecification } from "@3dwebprodconf/shared/src/schemas/ProductSpecification.ts";
import { readParsedJsonFromFile } from "@3dwebprodconf/shared/src/utilites/Importing.ts";
import { parseProductSpecification } from "@3dwebprodconf/shared/src/utilites/Parsing.ts";

export function readCatalogueFromFile(file: File): Promise<Catalogue> {
  return readParsedJsonFromFile(file, (data: unknown) =>
    CatalogueSchema.parse(data)
  );
}

export function readProductSpecificationFromFile(
  file: File
): Promise<ProductSpecification> {
  return readParsedJsonFromFile(file, (data: unknown) =>
    parseProductSpecification(data)
  );
}
