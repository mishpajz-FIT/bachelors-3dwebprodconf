export enum SubmissionType {
  POST = "POST",
  CONTACT_FORM = "CONTACT_FORM",
}

export interface SubmissionOption {
  type: SubmissionType;
  endpoint: string;
}

export interface CatalogueProduct {
  productSpecificationUrl: string;
  imageUrl: string;
  name: string;
  submission?: SubmissionOption;
}

export interface Catalogue {
  products: Record<string, CatalogueProduct>;
}
