import { z } from 'zod';

/**
 * Schema for validating user registration.
 */
export const registerSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100)
});

/**
 * Schema for validating user login.
 */
export const loginSchema = z.object({
    username: z.string(),
    password: z.string()
});

/**
 * Type for the input data to register a new user.
 * @typedef {Object} RegisterInput
 * @property {string} username - The username of the new user.
 * @property {string} password - The password of the new user.
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Type for the input data to log in a user.
 * @typedef {Object} LoginInput
 * @property {string} username - The username of the user.
 * @property {string} password - The password of the user.
 */
export type LoginInput = z.infer<typeof loginSchema>;
