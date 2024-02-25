import { Catalogue } from "@3dwebprodconf/shared/src/interfaces/Catalogue.ts";

export const fetchProducts = async (url: string): Promise<Catalogue> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  // TODO: Validate data

  return (await response.json()) as Catalogue;
};
