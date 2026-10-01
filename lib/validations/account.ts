import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_-]{1,50}$/, "Invalid identifier.");

export const uuidSchema = z.string().uuid("Invalid record identifier.");

export const profileUpdateSchema = z
  .object({
    full_name: z.string().trim().min(1).max(100).optional(),
    favorite_tradition: z.string().trim().min(1).max(50).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one profile field is required.");

export const progressUpdateSchema = z
  .object({
    course_id: slugSchema,
    completed_modules: z.array(z.string().trim().min(1).max(100)).max(100),
    progress_percent: z.number().int().min(0).max(100),
  })
  .strict();
export const bookmarkToggleSchema = z
  .object({
    course_id: slugSchema,
    quote_text: z.string().trim().max(1000).default(""),
    work_title: z.string().trim().max(200).default(""),
  })
  .strict();
export const reflectionCreateSchema = z
  .object({
    course_id: slugSchema,
    reflection_text: z.string().trim().min(1).max(5000),
    is_private: z.boolean().default(true),
  })
  .strict();
export const reflectionDeleteSchema = z
  .object({
    reflection_id: uuidSchema,
  })
  .strict();
