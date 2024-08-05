import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/apiError.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';

/**
 * Middleware to handle errors in the application.
 *
 * @param {Error} error - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const errorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);

    if (error instanceof ApiError) {
        return res
            .status(error.code)
            .json({ error: error.message, success: false });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
        success: false
    });
};
