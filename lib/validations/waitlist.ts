import { z } from "zod";

export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please provide a valid email address." })
    .max(255, { message: "Email cannot exceed 255 characters." }),
  source: z
    .string()
    .trim()
    .max(50, { message: "Source tag cannot exceed 50 characters." })
    .default("website_hero"),
  honeypot: z.string().optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
