import prisma from '../prisma/prisma';
import { s3Service } from './s3Service';
import { encryptionService } from './encryptionService';
import { idGenerationService } from './idGenerationService';
import { ApiError } from '../utils/apiError';
import { CreatePasteInput } from '../schemas/pasteSchemas';

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
}

export const pasteService = new PasteService();
