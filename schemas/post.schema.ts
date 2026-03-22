// tomato-classification-frontend/schemas/post.schema.ts
import { z } from "zod";

export const createPostSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title must be less than 100 characters")
        .regex(/^[A-Za-z0-9\s&().'/+-]+$/, "Title contains invalid characters"),

    content: z
        .string()
        .trim()
        .min(1, "Content is required")
        .max(500, "Content cannot exceed 500 characters"),

    image: z.file({ error: "Image is required" })
});

export const updatePostSchema = createPostSchema.partial()

export type PostCreate = z.infer<typeof createPostSchema>;
export type PostUpdate = z.infer<typeof updatePostSchema>;