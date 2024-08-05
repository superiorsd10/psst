import { HttpStatusCode } from './httpStatusCodes';

/**
 * Custom error class for API errors.
 * @extends Error
 */
export class ApiError extends Error {
    /**
     * Creates an instance of ApiError.
     * @param {number} code - The HTTP status code for the error.
     * @param {string} message - The error message.
     */
    constructor(
        public code: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * Creates a 400 Bad Request error.
     * @param {string} msg - The error message.
     * @returns {ApiError} - The created ApiError instance.
     */
    static badRequest(msg: string): ApiError {
        return new ApiError(HttpStatusCode.BAD_REQUEST, msg);
    }

    /**
     * Creates a 401 Unauthorized error.
     * @param {string} msg - The error message.
     * @returns {ApiError} - The created ApiError instance.
     */
    static unauthorized(msg: string): ApiError {
        return new ApiError(HttpStatusCode.UNAUTHORIZED, msg);
    }

    /**
     * Creates a 404 Not Found error.
     * @param {string} msg - The error message.
     * @returns {ApiError} - The created ApiError instance.
     */
    static notFound(msg: string): ApiError {
        return new ApiError(HttpStatusCode.NOT_FOUND, msg);
    }

    /**
     * Creates a 403 Forbidden error.
     * @param {string} msg - The error message.
     * @returns {ApiError} - The created ApiError instance.
     */
    static forbidden(msg: string): ApiError {
        return new ApiError(HttpStatusCode.FORBIDDEN, msg);
    }

    /**
     * Creates a 500 Internal Server Error.
     * @param {string} msg - The error message.
     * @returns {ApiError} - The created ApiError instance.
     */
    static internal(msg: string): ApiError {
        return new ApiError(HttpStatusCode.INTERNAL_SERVER_ERROR, msg);
    }
}
