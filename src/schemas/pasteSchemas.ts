import { z } from 'zod';

export const createPasteSchema = z.object({
    title: z.string().min(1).max(100),
    content: z.string().max(1024 * 1024),
    tags: z.string(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']),
    expirationTime: z.string().datetime().optional(),
    isSecured: z.boolean(),
    password: z.string().optional()
});

export const getPasteSchema = z.object({
    params: z.object({
        id: z.string()
    }),
    query: z.object({
        password: z.string().optional()
    })
});

export type CreatePasteInput = z.infer<typeof createPasteSchema>;
