import { Catalogue } from "@3dwebprodconf/shared/src/interfaces/Catalogue.ts";

import { CatalogueStore } from "../CatalogueStore.ts";

export const fetchCatalogue = async (url: string): Promise<Catalogue> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  // TODO: Validate data

  return (await response.json()) as Catalogue;
};

export const getCatalogue = async (fallbackUrl: string): Promise<Catalogue> => {
  if (!CatalogueStore.catalogue) {
    CatalogueStore.catalogue = await fetchCatalogue(fallbackUrl);
  }

  return CatalogueStore.catalogue;
};
