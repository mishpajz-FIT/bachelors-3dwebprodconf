import { z } from "zod";

export const ContactInfoSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  note: z.string().max(10000).optional(),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;
