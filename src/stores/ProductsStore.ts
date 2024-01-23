import { proxy } from "valtio";

import { fetchProducts } from "./actions/ProductsActions.ts";

export const ProductsStore = proxy({
  products: fetchProducts("/products/products.json").catch((error) => {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    throw new Error(`Failed to load products: ${message}`);
  }),
});
