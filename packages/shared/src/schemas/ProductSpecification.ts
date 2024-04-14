import { z } from "zod";

export const ColorSpecificationSchema = z.object({
  name: z.string().max(100),
  value: z.string().length(7).regex(/^#/),
  sortIndex: z.number(),
});

export const MaterialSpecificationSchema = z.object({
  name: z.string().max(100),
  modelMaterials: z.array(z.string()),
  colorVariationsSpecs: z.record(ColorSpecificationSchema),
});

export const MountingPointSpecificationSchema = z.object({
  position: z.tuple([z.number(), z.number(), z.number()]),
  rotation: z.tuple([z.number(), z.number(), z.number()]),
  isRequired: z.boolean(),
  mountableComponents: z.array(z.string()).min(1),
});

export const ComponentSpecificationSchema = z.object({
  name: z.string().max(100),
  description: z.string(),
  imageUrl: z.string(),
  modelUrl: z.string(),
  materialSpecs: z.record(MaterialSpecificationSchema),
  mountingPointsSpecs: z.record(MountingPointSpecificationSchema),
  positionOffset: z.tuple([z.number(), z.number(), z.number()]).optional(),
  rotationOffset: z.tuple([z.number(), z.number(), z.number()]).optional(),
  scaleOffset: z.tuple([z.number(), z.number(), z.number()]).optional(),
  ignoreCollisions: z.boolean().optional(),
});

export const BaseSpecificationSchema = z.object({
  component: z.string(),
});

export const ProductSpecificationSchema = z.object({
  baseSpecs: z.record(BaseSpecificationSchema),
  componentSpecs: z.record(ComponentSpecificationSchema),
});

export type ColorSpecification = z.infer<typeof ColorSpecificationSchema>;
export type MaterialSpecification = z.infer<typeof MaterialSpecificationSchema>;
export type MountingPointSpecification = z.infer<
  typeof MountingPointSpecificationSchema
>;
export type ComponentSpecification = z.infer<
  typeof ComponentSpecificationSchema
>;
export type BaseSpecification = z.infer<typeof BaseSpecificationSchema>;
export type ProductSpecification = z.infer<typeof ProductSpecificationSchema>;
