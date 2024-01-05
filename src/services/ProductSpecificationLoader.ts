import {ProductSpecification} from "../interfaces/ProductSpecification.ts";

export const loadProductSpecification = async (url: string) : Promise<ProductSpecification> => {
  try {
    const response = await fetch(url);
    const data = await response.json() as ProductSpecification;

    // TODO: Validate data

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    throw new Error(`Failed to load product specification: ${message}`);
  }
};
