export interface CatalogueProduct {
  productSpecificationUrl: string;
  imageUrl: string;
  name: string;
}

export type Catalogue = Record<string, CatalogueProduct>;
