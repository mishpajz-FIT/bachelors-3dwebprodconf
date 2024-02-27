export interface CatalogueProduct {
  productSpecificationUrl: string;
  imageUrl: string;
  name: string;
}

export interface Catalogue {
  products: Record<string, CatalogueProduct>;
}
