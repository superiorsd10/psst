import http from 'http';
import { Express } from 'express';
import config from './config/config.js';
import { redisService } from './services/redisService.js';
import { pasteClickService } from './services/pasteClickService.js';

/**
 * Starts the HTTP server and initializes services.
 * @async
 * @throws {Error} - Throws an error if initialization or server start fails.
 */
const startServer = async () => {
    try {
        await redisService.initialize(); // Initialize Redis
        console.info('Redis initialized successfully');

        await pasteClickService.startClickUpdatesWorker(); // Start background worker for click updates
        console.info('Click update worker started successfully');

        const { default: createApp } = await import('./app');
        const app: Express = createApp();

        const server = http.createServer(app);

        server.listen(config.port, () => {
            console.info(`Server is running on PORT ${config.port}`);
        });

        /**
         * Handles server shutdown on signal.
         * @param {string} signal - The signal received.
         */
        const shutdown = (signal: string) => {
            console.info(`${signal} received`);
            console.info('Closing HTTP server...');
            server.close(async () => {
                console.info('HTTP server closed');
                await redisService.disconnect(); // Disconnect Redis
                console.info('Redis disconnected');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM')); // Handle termination signal
        process.on('SIGINT', () => shutdown('SIGINT')); // Handle interrupt signal
    } catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();
