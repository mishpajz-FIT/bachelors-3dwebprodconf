import { SubmissionOption } from "@3dwebprodconf/shared/src/schemas/Catalogue.ts";
import { SubmissionResponseSchema } from "@3dwebprodconf/shared/src/schemas/network/SubmissionResponse.ts";
import { t } from "i18next";

export async function submitProduct(
  submissionOption: SubmissionOption,
  jsonData: string
): Promise<string | undefined> {
  const url = submissionOption.endpointUrl;
  const fetchOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonData,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(t("errorNetwork", { status: response.status }));
  }

  let responseData;
  try {
    responseData = SubmissionResponseSchema.parse(await response.json());
  } catch {
    responseData = {};
  }

  return responseData ? responseData.redirectUrl : undefined;
}
