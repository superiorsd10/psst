import { Request, Response, NextFunction } from 'express';
import { userService } from '../../services/userService';
import { LoginInput, RegisterInput } from '../../schemas/userSchemas';

class UserController {
    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
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

    async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
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
