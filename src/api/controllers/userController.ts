import { Request, Response, NextFunction } from 'express';
import { userService } from '../../services/userService';
import { ApiError } from '../../utils/apiError';

class UserController {
    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { username, password } = req.body;
            const result = await userService.register(username, password);
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
            const { username, password } = req.body;
            const result = await userService.login(username, password);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();
