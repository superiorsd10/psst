import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration object containing environment variables.
 * @type {Object}
 * @property {number|string} port - The port the server will listen on.
 * @property {string} redisUrl - The URL for the Redis server.
 * @property {string} jwtSecret - The secret key for JWT.
 * @property {string} awsRegion - The AWS region.
 * @property {string} awsS3Bucket - The name of the AWS S3 bucket.
 * @property {string} awsAccessKeyId - The AWS access key ID.
 * @property {string} awsSecretAccessKey - The AWS secret access key.
 * @property {string} encryptionKey - The encryption key for securing content.
 */
const config = {
    port: process.env.PORT || 3000,
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    jwtSecret: process.env.JWT_SECRET || '',
    awsRegion: process.env.AWS_REGION || '',
    awsS3Bucket: process.env.AWS_S3_BUCKET || '',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    encryptionKey: process.env.ENCRYPTION_KEY || '',
};

export default config;
