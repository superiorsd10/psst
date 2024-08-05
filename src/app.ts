import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { rateLimiterMiddleware } from './api/middlewares/rateLimiterMiddleware.js';
import { errorHandlerMiddleware } from './api/middlewares/errorHandlerMiddleware.js';
import userRoutes from './api/routes/userRoutes.js';
import pasteRoutes from './api/routes/pasteRoutes.js';

/**
 * Creates and configures an Express application.
 * @returns {Express} - The configured Express application.
 */
const createApp = (): Express => {
    const app = express();

    app.use(helmet()); // Set security-related HTTP headers
    app.use(morgan('dev')); // Log HTTP requests
    app.use(cors()); // Enable Cross-Origin Resource Sharing
    app.use(express.json()); // Parse JSON request bodies

    app.use(rateLimiterMiddleware); // Apply rate limiting middleware

    app.use('/api/user', userRoutes); // Mount user routes
    app.use('/api/paste', pasteRoutes); // Mount paste routes

    app.use(errorHandlerMiddleware); // Apply global error handler

    return app;
};

export default createApp;
