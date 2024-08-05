import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../services/jwtService.js';
import { ApiError } from '../../utils/apiError.js';

/**
 * Middleware to authenticate JWT token from the request header.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(ApiError.unauthorized('No token provided'));
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
        return next(ApiError.unauthorized('Invalid token format'));
    }

    try {
        const decoded = jwtService.verifyToken(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        next(ApiError.unauthorized('Invalid token'));
    }
};
