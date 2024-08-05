import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import config from '../config/config.js';

class JwtService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        (this.secret = config.jwtSecret), (this.expiresIn = '1d');
    }

    generateToken(payload: object): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw ApiError.unauthorized('Invalid token');
        }
    }
}

export const jwtService = new JwtService();
