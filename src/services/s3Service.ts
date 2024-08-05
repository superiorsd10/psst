import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ApiError } from '../utils/apiError';
import config from '../config/config';

class S3Service {
    private s3Client: S3Client;
    private bucket: string;

    constructor() {
        this.s3Client = new S3Client({
            region: config.awsRegion,
            credentials: {
                accessKeyId: config.awsAccessKeyId,
                secretAccessKey: config.awsSecretAccessKey
            }
        });
        this.bucket = config.awsS3Bucket;
    }

    async uploadFile(key: string, body: Buffer): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body
        });

        try {
            await this.s3Client.send(command);
        } catch (error) {
            throw ApiError.internal('Error uploading file to S3');
        }
    }

    async getSignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        try {
            return await getSignedUrl(this.s3Client, command);
        } catch (error) {
            throw ApiError.internal('Error generating signed URL');
        }
    }
}

export const s3Service = new S3Service();
