import bcrypt from 'bcryptjs';
import prisma from '../prisma/prisma.js';
import { jwtService } from './jwtService.js';
import { ApiError } from '../utils/apiError.js';

class UserService {
    /**
     * Registers a new user and generates an authentication token.
     * @param {string} username - The username of the new user.
     * @param {string} password - The password of the new user.
     * @returns {Promise<{ token: string }>} - The generated authentication token.
     * @throws {ApiError} - Throws an error if the username already exists or if there is an issue registering the user.
     */
    async register(
        username: string,
        password: string
    ): Promise<{ token: string }> {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { username }
            });
            if (existingUser) {
                throw ApiError.badRequest('Username already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword
                }
            });

            const token = jwtService.generateToken({ userId: user.id });
            return { token };
        } catch (error) {
            console.error('User Service register', error);
            if (error instanceof ApiError) {
                throw error;
            } else {
                throw ApiError.internal(
                    'An error occurred while registering the user'
                );
            }
        }
    }

    /**
     * Authenticates a user and generates an authentication token.
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<{ token: string }>} - The generated authentication token.
     * @throws {ApiError} - Throws an error if the credentials are invalid or if there is an issue logging in.
     */
    async login(
        username: string,
        password: string
    ): Promise<{ token: string }> {
        try {
            const user = await prisma.user.findUnique({ where: { username } });
            if (!user) {
                throw ApiError.unauthorized('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                throw ApiError.unauthorized('Invalid credentials');
            }

            const token = jwtService.generateToken({ userId: user.id });
            return { token };
        } catch (error) {
            console.error('User Service login', error);
            if (error instanceof ApiError) {
                throw error;
            } else {
                throw ApiError.internal('An error occurred while logging in');
            }
        }
    }
}

export const userService = new UserService();
