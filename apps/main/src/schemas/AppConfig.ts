import { z } from "zod";

export const AppConfigSchema = z.object({
  camera: z.object({
    isOrthogonal: z.boolean(),
  }),
  shadows: z.object({
    floorShadow: z.boolean(),
  }),
  spatialUi: z.object({
    selectionColors: z.object({
      outline: z.object({
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
  sources: z.object({
    catalogueUrl: z.string(),
    homepageUrl: z.string(),
  }),
  capabilities: z.object({
    savePdfButton: z.boolean(),
  }),
  images: z.object({
    logo: z.object({
      light: z.string(),
      dark: z.string(),
    }),
    favicon: z.string(),
  }),
  title: z.string(),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
