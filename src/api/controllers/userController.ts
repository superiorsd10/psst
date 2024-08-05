import { Request, Response, NextFunction } from 'express';
import { userService } from '../../services/userService.js';
import { LoginInput, RegisterInput } from '../../schemas/userSchemas.js';

class UserController {
    /**
     * Register a new user.
     * 
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next middleware function.
     * @returns {Promise<void>}
     */
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: RegisterInput = req.body;
            const result = await userService.register(
                user.username,
                user.password
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Log in a user.
     * 
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next middleware function.
     * @returns {Promise<void>}
     */
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: LoginInput = req.body;
            const result = await userService.login(
                user.username,
                user.password
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();
