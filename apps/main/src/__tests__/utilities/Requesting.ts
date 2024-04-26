import { SubmissionOption } from "@3dwebprodconf/shared/src/schemas/Catalog.ts";
import { UserCreationSchema } from "@3dwebprodconf/shared/src/schemas/UserCreation.ts";
import { generateMock } from "@anatine/zod-mock";
import { enableFetchMocks } from "jest-fetch-mock";

import { submitProduct } from "../../utilities/Requesting.ts";

enableFetchMocks();

jest.mock("i18next", () => ({
  t: jest.fn().mockImplementation((key) => {
    return `${key}`;
  }),
}));

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("submitProduct", () => {
  it("submits product data successfully and returns a redirect URL", async () => {
    const submissionOption = {
      type: "POST",
      endpointUrl: "https://example.com/submit",
    } as SubmissionOption;
    const jsonData = JSON.stringify(generateMock(UserCreationSchema));
    const mockResponse = { redirectUrl: "https://example.com/confirmation" };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await submitProduct(submissionOption, jsonData);
    expect(result).toEqual(mockResponse.redirectUrl);
    expect(fetch).toHaveBeenCalledWith(submissionOption.endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
    });
  });

  it("submits product data successfully without a redirect URL", async () => {
    const submissionOption = {
      type: "POST",
      endpointUrl: "https://example.com/submit",
    } as SubmissionOption;
    const jsonData = JSON.stringify(generateMock(UserCreationSchema));
    const mockResponse = {};

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await submitProduct(submissionOption, jsonData);
    expect(result).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(submissionOption.endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
    });
  });

  it("handle network error", async () => {
    const submissionOption = {
      type: "POST",
      endpointUrl: "https://example.com/submit",
    } as SubmissionOption;
    const jsonData = JSON.stringify(generateMock(UserCreationSchema));

    fetchMock.mockReject(new Error("Network failure"));

    await expect(submitProduct(submissionOption, jsonData)).rejects.toThrow(
      "Network failure"
    );
  });

  it("throw error when response is not ok", async () => {
    const submissionOption = {
      type: "CONTACT_FORM",
      endpointUrl: "https://example.com/submit",
    } as SubmissionOption;
    const jsonData = JSON.stringify({ product: "New Product" });

    fetchMock.mockResponseOnce("", { status: 500 });

    await expect(submitProduct(submissionOption, jsonData)).rejects.toThrow(
      "errorNetwork"
    );
  });
});
