import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { rateLimiterMiddleware } from './api/middlewares/rateLimiterMiddleware';
import { errorHandlerMiddleware } from './api/middlewares/errorHandlerMiddleware';

const createApp = (): Express => {
    const app = express();

    app.use(helmet());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());

    app.use(rateLimiterMiddleware);

    app.use(errorHandlerMiddleware);

    return app;
};

export default createApp;
