import bcrypt from 'bcrypt';
import prisma from '../prisma/prisma';
import { jwtService } from './jwtService';
import { ApiError } from '../utils/apiError';

class UserService {
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
