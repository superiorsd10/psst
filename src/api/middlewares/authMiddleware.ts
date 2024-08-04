import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../interfaces/authRequest';
import { jwtService } from '../../services/jwtService';
import { ApiError } from '../../utils/apiError';

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.get('authorization');
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
