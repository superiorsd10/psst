import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../services/jwtService';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next();
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
        return next();
    }

    try {
        const decoded = jwtService.verifyToken(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        next();
    }
};
