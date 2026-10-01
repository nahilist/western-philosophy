import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email().max(255);

export const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .max(128, "Password cannot exceed 128 characters.");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export const signupSchema = loginSchema.extend({
  full_name: z.string().trim().min(1).max(100),
});
