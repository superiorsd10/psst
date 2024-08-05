import http from 'http';
import { Express } from 'express';
import config from './config/config';
import { redisService } from './services/redisService';
import { kafkaProducerService } from './services/kafkaService';

const PORT = config.port;

const startServer = async () => {
    try {
        await redisService.initialize();
        console.info('Redis initialized successfully');

        await kafkaProducerService.connect();

        const { default: createApp } = await import('./app');

        const app: Express = createApp();

        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.info(`Server is running on PORT ${PORT}`);
        });

        const shutdown = (signal: string) => {
            console.info(`${signal} received`);
            console.info('Closing http server...');
            server.close(async () => {
                console.info('HTTP server closed');
                await redisService.disconnect();
                console.info('Redis disconnected');
                await kafkaProducerService.disconnect();
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();
