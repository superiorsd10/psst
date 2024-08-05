import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisService } from '../../services/redisService.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';

export const rateLimiterMiddleware = rateLimit({
    store: new RedisStore({
        sendCommand: (...args: string[]) =>
            redisService.getClient().sendCommand(args)
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        console.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(HttpStatusCode.TOO_MANY_REQUESTS).json({
            error: 'Too many requests, please try again later.',
            success: false
        });
    },
    keyGenerator: (req) => {
        return req.ip!;
    }
});
