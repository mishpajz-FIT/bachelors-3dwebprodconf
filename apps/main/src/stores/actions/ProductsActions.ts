import { Products } from "@3dwebprodconf/shared/src/interfaces/Products.ts";

export const fetchProducts = async (url: string): Promise<Products> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  // TODO: Validate data

  return (await response.json()) as Products;
};
