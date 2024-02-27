import { Catalogue } from "@3dwebprodconf/shared/src/interfaces/Catalogue.ts";
import { proxy } from "valtio";

export const CatalogueStore = proxy<Catalogue>({ products: {} });
