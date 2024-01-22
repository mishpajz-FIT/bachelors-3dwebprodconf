import { ProductSpecification } from "../../interfaces/ProductSpecification.ts";

export const fetchProductSpecification = async (
  url: string
): Promise<ProductSpecification> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  // TODO: Validate data

  return (await response.json()) as ProductSpecification;
};
