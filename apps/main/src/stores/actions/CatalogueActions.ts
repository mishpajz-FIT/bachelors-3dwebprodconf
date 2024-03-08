import { SubmissionResponse } from "@3dwebprodconf/shared/src/interfaces/SubmissionResponse.ts";
import {
  Catalogue,
  CatalogueSchema,
  SubmissionOption,
} from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";

import { CatalogueStore } from "../CatalogueStore.ts";

async function fetchCatalogue(url: string): Promise<Catalogue> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return CatalogueSchema.parse(await response.json());
}

export async function getCatalogue(fallbackUrl: string): Promise<Catalogue> {
  if (!CatalogueStore.catalogue) {
    CatalogueStore.catalogue = await fetchCatalogue(fallbackUrl);
  }

  return CatalogueStore.catalogue;
}

export async function submitProduct(
  submissionOption: SubmissionOption,
  data: string
): Promise<string | undefined> {
  const url = submissionOption.endpointUrl;
  const fetchOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  };

  const response = await fetch(url, fetchOptions);
  const responseData = (await response.json()) as SubmissionResponse;

  if (responseData?.redirectUrl) {
    return responseData.redirectUrl;
  }

  return undefined;
}
