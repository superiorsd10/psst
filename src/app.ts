import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { rateLimiterMiddleware } from './api/middlewares/rateLimiterMiddleware.js';
import { errorHandlerMiddleware } from './api/middlewares/errorHandlerMiddleware.js';
import userRoutes from './api/routes/userRoutes.js';
import pasteRoutes from './api/routes/pasteRoutes.js';

const createApp = (): Express => {
    const app = express();

    app.use(helmet());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());

    app.use(rateLimiterMiddleware);

    app.use('/api/user', userRoutes);
    app.use('/api/paste', pasteRoutes);

    app.use(errorHandlerMiddleware);

    return app;
};

export default createApp;
