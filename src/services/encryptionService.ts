import crypto from 'crypto';
import { ApiError } from '../utils/apiError';
import config from '../config/config.js';

class EncryptionService {
    private algorithm = 'aes-256-cbc';
    private key = crypto.scryptSync(config.encryptionKey, 'salt', 32);

    encrypt(text: string): { encryptedData: string; iv: string } {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return { encryptedData: encrypted, iv: iv.toString('hex') };
    }

    decrypt(encryptedData: string, iv: string): string {
        try {
            const decipher = crypto.createDecipheriv(
                this.algorithm,
                this.key,
                Buffer.from(iv, 'hex')
            );
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            throw ApiError.badRequest('Invalid password or corrupted data');
        }
    }

    calculateCRC32(data: Buffer): string {
        return crypto.createHash('crc32').update(data).digest('hex');
    }
}

export const encryptionService = new EncryptionService();
