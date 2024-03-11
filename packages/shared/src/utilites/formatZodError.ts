import { ZodError } from "zod";

export function formatZodError(zodError: ZodError) {
  const errorMessages = zodError.issues.map((issue) => {
    const pathString = issue.path.join(".");
    return `${issue.message}, path: ${pathString}`;
  });

  return `Error while parsing: ${errorMessages.join("; ")}`;
}
