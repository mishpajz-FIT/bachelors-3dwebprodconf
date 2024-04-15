import { z } from "zod";

export const SubmissionTypeSchema = z.enum([
  "POST",
  "CONTACT_FORM",
  "REDIRECT",
]);

export const SubmissionOptionSchema = z.object({
  type: SubmissionTypeSchema,
  endpointUrl: z.string().url(),
});

export const CatalogProductSchema = z.object({
  name: z.string().max(100),
  productSpecificationUrl: z.string(),
  imageUrl: z.string(),
  submission: SubmissionOptionSchema.optional(),
});

export const CatalogSchema = z.object({
  products: z.record(CatalogProductSchema),
});

export type SubmissionType = z.infer<typeof SubmissionTypeSchema>;
export type SubmissionOption = z.infer<typeof SubmissionOptionSchema>;
export type CatalogProduct = z.infer<typeof CatalogProductSchema>;
export type Catalog = z.infer<typeof CatalogSchema>;
