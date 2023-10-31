import {ProductOptions} from "../interfaces/ProductOptions.ts";

export const loadProductOptions = async (url: string) : Promise<ProductOptions> => {
  try {
    const response = await fetch(url);
    const data = await response.json() as ProductOptions;

    // TODO: Validate data

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    throw new Error(`Failed to load product configuration: ${message}`);
  }
};
