import { ZodError } from "zod";

import { formatZodError } from "../../utilites/Formatting.ts";

jest.mock("i18next", () => ({
  t: jest.fn().mockImplementation((key) => {
    return `${key}`;
  }),
}));

describe("formatZodError", () => {
  it("formats ZodError correctly with multiple issues", () => {
    const zodError = new ZodError([
      {
        message: "Invalid input",
        path: ["field1", "field2"],
        code: "custom",
      },
      {
        message: "Required",
        path: ["field3"],
        code: "custom",
      },
    ]);

    const result = formatZodError(zodError);

    expect(result).toBe(
      "errorWhileParsingInvalid input: field1.field2; Required: field3"
    );
  });

  it("handles empty paths correctly", () => {
    const zodError = new ZodError([
      {
        message: "Unacceptable value",
        path: [],
        code: "custom",
      },
    ]);

    const result = formatZodError(zodError);

    expect(result).toBe("errorWhileParsingUnacceptable value: ");
  });

  it("handles empty messages", () => {
    const zodError = new ZodError([]);

    const result = formatZodError(zodError);

    expect(result).toBe("errorWhileParsing");
  });
});
