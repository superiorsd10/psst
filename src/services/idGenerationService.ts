import { customAlphabet } from 'nanoid';
import pkg from 'bloom-filters';
const { BloomFilter } = pkg;
import prisma from '../prisma/prisma.js';

class IdGenerationService {
    private nanoid: (size?: number) => string;
    private bloomFilter: pkg.BloomFilter;

    constructor() {
        this.nanoid = customAlphabet(
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            10
        );

        const expectedItems = 10000000;
        const falsePositiveRate = 0.01;

        this.bloomFilter = BloomFilter.create(expectedItems, falsePositiveRate);
        this.initializeBloomFilter();
    }

    /**
     * Initializes the Bloom filter with existing IDs from the database.
     * @private
     */
    private async initializeBloomFilter() {
        const existingIds = await prisma.paste.findMany({
            select: { id: true }
        });
        existingIds.forEach(({ id }) => this.bloomFilter.add(id));
    }

    /**
     * Generates a unique ID.
     * @returns {Promise<string>} The generated unique ID.
     * @throws {Error} If a unique ID cannot be generated after multiple attempts.
     */
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
