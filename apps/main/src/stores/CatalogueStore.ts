import { proxy } from "valtio";

import { fetchProducts } from "./actions/CatalogueActions.ts";
import { globalConfig } from "../configurations/Config.ts";

export const CatalogueStore = proxy(
  fetchProducts(globalConfig.config.sources.catalogue).catch((error) => {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    throw new Error(`Failed to load products: ${message}`);
  })
);
