import { Catalog } from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { proxy } from "valtio";

export type CatalogStore = Catalog;

export const CatalogStore = proxy<CatalogStore>({ products: {} });
