declare namespace Express {
    export interface Request {
        /**
         * Optional user ID extracted from the authentication token.
         * @type {string}
         */
        userId?: string;
    }
}
