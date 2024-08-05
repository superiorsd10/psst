import { z } from 'zod';

/**
 * Schema for validating the creation of a new paste.
 */
export const createPasteSchema = z.object({
    title: z.string().min(1).max(100),
    content: z.string().max(1024 * 1024),
    tags: z.string(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']),
    expirationTime: z.string().datetime().optional(),
    isSecured: z.boolean(),
    password: z.string().optional()
});

/**
 * Type for the input data to create a new paste.
 * @typedef {Object} CreatePasteInput
 * @property {string} title - The title of the paste.
 * @property {string} content - The content of the paste.
 * @property {string} tags - The tags associated with the paste.
 * @property {'PUBLIC'|'PRIVATE'} visibility - The visibility of the paste.
 * @property {string} [expirationTime] - The expiration time of the paste.
 * @property {boolean} isSecured - Whether the paste is secured with a password.
 * @property {string} [password] - The password for the paste.
 */
export type CreatePasteInput = z.infer<typeof createPasteSchema>;
