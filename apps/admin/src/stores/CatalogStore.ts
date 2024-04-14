import { Catalog } from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { proxy } from "valtio";

export const CatalogStore = proxy<Catalog>({ products: {} });
