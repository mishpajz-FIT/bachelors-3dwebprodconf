import {ProductConfiguration} from "../interfaces/ProductConfiguration.ts";

export const loadProductConfiguration = async (url: string) : Promise<ProductConfiguration> => {
  try {
    const response = await fetch(url);
    const data = await response.json() as ProductConfiguration;

    // TODO: Validate data

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    throw new Error(`Failed to load product configuration: ${message}`);
  }
};
