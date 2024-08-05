import { customAlphabet } from 'nanoid';
import { BloomFilter } from 'bloom-filters';
import prisma from '../prisma/prisma';

class IdGenerationService {
    private nanoid: (size?: number) => string;
    private bloomFilter: BloomFilter;

    constructor() {
        this.nanoid = customAlphabet(
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            10
        );
        this.bloomFilter = new BloomFilter(10000000, 0.01);
        this.initializeBloomFilter();
    }

    private async initializeBloomFilter() {
        const existingIds = await prisma.paste.findMany({
            select: { id: true }
        });
        existingIds.forEach(({ id }) => this.bloomFilter.add(id));
    }

    async generateUniqueId(): Promise<string> {
        let id: string;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            id = this.nanoid();
            attempts++;

            if (attempts >= maxAttempts) {
                throw new Error(
                    'Failed to generate a unique ID after multiple attempts'
                );
            }
        } while (this.bloomFilter.has(id));

        this.bloomFilter.add(id);
        return id;
    }
}

export const idGenerationService = new IdGenerationService();
