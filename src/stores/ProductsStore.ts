import { proxy } from "valtio";

import { fetchProducts } from "./actions/ProductsActions.ts";
import { globalConfig } from "../configurations/Config.ts";

export const ProductsStore = proxy({
  products: fetchProducts(globalConfig.config.sources.products).catch(
    (error) => {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      throw new Error(`Failed to load products: ${message}`);
    }
  ),
});
