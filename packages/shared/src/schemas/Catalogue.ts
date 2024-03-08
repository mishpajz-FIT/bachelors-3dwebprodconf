import { z } from "zod";

export const SubmissionTypeSchema = z.enum(["POST", "CONTACT_FORM"]);

export const SubmissionOptionSchema = z.object({
  type: SubmissionTypeSchema,
  endpointUrl: z.string().url(),
});

export const CatalogueProductSchema = z.object({
  name: z.string().max(100),
  productSpecificationUrl: z.string().url(),
  imageUrl: z.string().url(),
  submission: SubmissionOptionSchema.optional(),
});

export const CatalogueSchema = z.object({
  products: z.record(CatalogueProductSchema),
});

export type SubmissionType = z.infer<typeof SubmissionTypeSchema>;
export type SubmissionOption = z.infer<typeof SubmissionOptionSchema>;
export type CatalogueProduct = z.infer<typeof CatalogueProductSchema>;
export type Catalogue = z.infer<typeof CatalogueSchema>;
