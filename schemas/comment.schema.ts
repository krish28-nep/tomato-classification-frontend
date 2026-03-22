// tomato-classification-frontend/schemas/commment.schema.ts
import { z } from "zod";

export const createCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Content is required")
        .max(500, "Content cannot exceed 500 characters"),
});

export const updateCommentSchema = createCommentSchema.partial()

export type CommentCreate = z.infer<typeof createCommentSchema>;
export type CommentUpdate = z.infer<typeof updateCommentSchema>;