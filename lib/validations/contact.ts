import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name cannot exceed 100 characters." }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please provide a valid email address." })
    .max(255, { message: "Email cannot exceed 255 characters." }),
  subject: z
    .string()
    .trim()
    .min(2, { message: "Subject must be at least 2 characters long." })
    .max(150, { message: "Subject cannot exceed 150 characters." }),
  message: z
    .string()
    .trim()
    .min(5, { message: "Message must be at least 5 characters long." })
    .max(3000, { message: "Message cannot exceed 3,000 characters." }),
  honeypot: z.string().optional(), // Invisible spam trap - should always be empty
});

export type ContactInput = z.infer<typeof contactSchema>;
