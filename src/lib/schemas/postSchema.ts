import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  max_participants: z
    .number()
    .int()
    .min(1, "Maximum participants must be at least 1"),
});

export type PostFormInputs = z.infer<typeof postSchema>;
