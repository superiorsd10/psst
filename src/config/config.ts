import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    jwtSecret: process.env.JWT_SECRET || '',
    awsRegion: process.env.AWS_REGION || '',
    awsS3Bucket: process.env.AWS_S3_BUCKET || '',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    encryptionKey: process.env.ENCRYPTION_KEY || '',
    kafkaBroker: process.env.KAFKA_BROKER || ''
};

export default config;
