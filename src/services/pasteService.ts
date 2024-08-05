import prisma from '../prisma/prisma.js';
import { s3Service } from './s3Service.js';
import { encryptionService } from './encryptionService.js';
import { idGenerationService } from './idGenerationService.js';
import { ApiError } from '../utils/apiError.js';
import { CreatePasteInput } from '../schemas/pasteSchemas.js';
import { redisService } from './redisService.js';
import { pasteClickService } from './pasteClickService.js';

class PasteService {
    async createPaste(
        input: CreatePasteInput,
        userId: string
    ): Promise<{ pasteId: string }> {
        const pasteId = await idGenerationService.generateUniqueId();
        const contentKey = `pastes/${pasteId}`;

        let contentToStore = input.content;
        let checksumCRC: string | undefined;

        if (input.isSecured && input.password) {
            const { encryptedData, iv } =
                encryptionService.encrypt(contentToStore);
            contentToStore = JSON.stringify({ encryptedData, iv });
            checksumCRC = encryptionService.calculateCRC32(
                Buffer.from(contentToStore)
            );
        }

        if (Buffer.byteLength(contentToStore, 'utf8') > 1024 * 1024) {
            throw ApiError.badRequest('Paste content exceeds 1MB limit');
        }

        try {
            await s3Service.uploadFile(contentKey, Buffer.from(contentToStore));

            await prisma.paste.create({
                data: {
                    id: pasteId,
                    title: input.title,
                    contentUrl: contentKey,
                    userId,
                    tags: input.tags.split(',').map((tag) => tag.trim()),
                    visibility: input.visibility,
                    expirationTime: input.expirationTime,
                    isSecured: input.isSecured,
                    password: input.isSecured ? input.password : undefined,
                    checksumCRC,
                    contentSize: Buffer.byteLength(contentToStore, 'utf8')
                }
            });

            return { pasteId };
        } catch (error) {
            throw ApiError.internal('Error creating paste');
        }
    }

    async getPaste(
        pasteId: string,
        password?: string,
        requestUserId?: string
    ): Promise<any> {
        const cachedPaste = await redisService.get(`paste:${pasteId}`);

        if (cachedPaste) {
            return JSON.parse(cachedPaste);
        }

        const paste = await prisma.paste.findUnique({ where: { id: pasteId } });

        if (!paste) {
            throw ApiError.notFound('Paste not found');
        }

        if (paste.expirationTime && paste.expirationTime < new Date()) {
            throw ApiError.notFound('Paste has expired');
        }

        if (paste.visibility === 'PRIVATE' && paste.userId !== requestUserId) {
            throw ApiError.forbidden(
                'You do not have permission to view this paste'
            );
        }
        const contentUrl = await s3Service.getSignedUrl(paste.contentUrl);

        let content = await this.fetchContent(contentUrl);

        if (paste.isSecured) {
            if (!password) {
                throw ApiError.unauthorized('Password required for this paste');
            }

            if (password !== paste.password) {
                throw ApiError.unauthorized('Incorrect password');
            }

            if (paste.checksumCRC) {
                const currentCRC = encryptionService.calculateCRC32(
                    Buffer.from(content)
                );
                if (currentCRC !== paste.checksumCRC) {
                    throw ApiError.badRequest(
                        'Paste content integrity check failed'
                    );
                }
            }

            const { encryptedData, iv } = JSON.parse(content);
            content = encryptionService.decrypt(encryptedData, iv);
        }

        const pasteData = { ...paste, content };

        await redisService.set(`paste:${pasteId}`, JSON.stringify(pasteData));

        await pasteClickService.incrementClick(pasteId);

        return pasteData;
    }

    private async fetchContent(url: string): Promise<string> {
        const response = await fetch(url);
        if (!response.ok) {
            throw ApiError.internal('Error fetching paste content');
        }

        return await response.text();
    }
}

export const pasteService = new PasteService();
