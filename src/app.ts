import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

const createApp = (): Express => {
    const app = express();

    app.use(helmet());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());

    return app;
};

export default createApp;
