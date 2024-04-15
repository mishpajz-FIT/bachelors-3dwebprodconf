import { z } from "zod";

export const UserComponentSchema = z.object({
  componentSpec: z.string(),
  materials: z.record(z.string()),
  mounted: z.record(z.string()),
});

export const UserCreationSchema = z.object({
  product: z.string(),
  base: z.string(),
  components: z.record(UserComponentSchema),
});

export type UserComponent = z.infer<typeof UserComponentSchema>;
export type UserCreation = z.infer<typeof UserCreationSchema>;
