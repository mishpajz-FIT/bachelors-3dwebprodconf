import { z } from "zod";

export const AdminConfigSchema = z.object({
  spatialUi: z.object({
    gizmoColors: z.object({
      r: z.object({
        light: z.string().length(7).regex(/^#/),
        dark: z.string().length(7).regex(/^#/),
      }),
      g: z.object({
        light: z.string().length(7).regex(/^#/),
        dark: z.string().length(7).regex(/^#/),
      }),
      b: z.object({
        light: z.string().length(7).regex(/^#/),
        dark: z.string().length(7).regex(/^#/),
      }),
    }),
    gridColors: z.object({
      primary: z.object({
        light: z.string().length(7).regex(/^#/),
        dark: z.string().length(7).regex(/^#/),
      }),
      secondary: z.object({
        light: z.string().length(7).regex(/^#/),
        dark: z.string().length(7).regex(/^#/),
      }),
    }),
  }),
  ui: z.object({
    colors: z.object({
      primary: z.object({
        light: z.string().length(7).regex(/^#/),
        dark: z.string().length(7).regex(/^#/),
        overlayTextWhiteLight: z.boolean(),
        overlayTextWhiteDark: z.boolean(),
      }),
      error: z.object({
        light: z.string().length(7).regex(/^#/),
        dark: z.string().length(7).regex(/^#/),
      }),
    }),
  }),
});

export type AdminConfig = z.infer<typeof AdminConfigSchema>;
