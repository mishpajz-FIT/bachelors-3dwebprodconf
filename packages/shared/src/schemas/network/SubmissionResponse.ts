import { z } from "zod";

export const SubmissionResponseSchema = z
  .object({
    redirectUrl: z.string().url().optional(),
  })
  .optional();

export type SubmissionResponse = z.infer<typeof SubmissionResponseSchema>;
