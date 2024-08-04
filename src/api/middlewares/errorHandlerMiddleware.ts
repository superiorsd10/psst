import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/apiError';
import { HttpStatusCode } from '../../utils/httpStatusCodes';

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
