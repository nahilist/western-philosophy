import { z } from "zod";

export const dilemmaVoteSchema = z.object({
  dilemma_id: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9_-]{1,50}$/, { message: "Invalid dilemma identifier." }),
  selected_choice: z
    .string()
    .trim()
    .min(1, { message: "Selected choice cannot be empty." })
    .max(100, { message: "Selected choice cannot exceed 100 characters." }),
  voter_identifier: z
    .string()
    .trim()
    .min(8, { message: "Voter fingerprint must be at least 8 characters." })
    .max(100, { message: "Voter fingerprint cannot exceed 100 characters." })
    .optional(),
});

export type DilemmaVoteInput = z.infer<typeof dilemmaVoteSchema>;
