import { t } from "i18next";
import { ZodError } from "zod";

export function formatZodError(zodError: ZodError) {
  const errorMessages = zodError.issues.map((issue) => {
    const pathString = issue.path.join(".");
    return `${issue.message}: ${pathString}`;
  });

  return t("errorWhileParsing") + errorMessages.join("; ");
}
