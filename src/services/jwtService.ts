import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import config from '../config/config.js';

class JwtService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        this.secret = config.jwtSecret;
        this.expiresIn = '1d';
    }

    /**
     * Generates a JWT token with the given payload.
     * @param {object} payload - The payload to encode in the token.
     * @returns {string} The generated JWT token.
     */
    generateToken(payload: object): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    /**
     * Verifies a given JWT token.
     * @param {string} token - The JWT token to verify.
     * @returns {object} The decoded payload.
     * @throws {ApiError} If the token is invalid.
     */
    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw ApiError.unauthorized('Invalid token');
        }
    }
}

export const jwtService = new JwtService();
