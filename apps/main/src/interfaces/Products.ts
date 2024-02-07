export interface Product {
  productSpecificationUrl: string;
  imageUrl: string;
  name: string;
}

export type Products = Record<string, Product>;
