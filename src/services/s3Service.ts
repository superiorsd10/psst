import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ApiError } from '../utils/apiError.js';
import config from '../config/config.js';

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

    /**
     * Uploads a file to the S3 bucket.
     * @param {string} key - The key under which to store the file.
     * @param {Buffer} body - The content of the file to upload.
     * @returns {Promise<void>}
     * @throws {ApiError} - Throws an error if there is an issue uploading the file.
     */
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

    /**
     * Generates a signed URL for accessing a file in S3.
     * @param {string} key - The key of the file to generate a signed URL for.
     * @returns {Promise<string>} - The signed URL for the file.
     * @throws {ApiError} - Throws an error if there is an issue generating the signed URL.
     */
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

    /**
     * Deletes a file from the S3 bucket.
     * @param {string} key - The key of the file to delete.
     * @returns {Promise<void>}
     * @throws {ApiError} - Throws an error if there is an issue deleting the file.
     */
    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        try {
            await this.s3Client.send(command);
        } catch (error) {
            console.error('Error deleting file from S3:', error);
            throw ApiError.internal('Error deleting file from S3');
        }
    }
}

export const s3Service = new S3Service();
