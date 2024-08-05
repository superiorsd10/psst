import { redisService } from './redisService.js';
import prisma from '../prisma/prisma.js';

const CLICK_SET_KEY = 'paste:clicks';
const BATCH_SIZE = 100;
const UPDATE_INTERVAL = 60 * 60 * 1000;

class PasteClickService {
    async incrementClick(pasteId: string): Promise<void> {
        await redisService.zincrby(CLICK_SET_KEY, 1, pasteId);
    }

    private async processBatch(): Promise<void> {
        const clicks = await redisService.zrangebyscore(
            CLICK_SET_KEY,
            '1',
            '+inf'
        );
        const batchClicks = clicks.slice(0, BATCH_SIZE);

        if (batchClicks.length === 0) {
            return;
        }

        const updates = batchClicks.map(async (pasteId) => {
            const score = await redisService.zincrby(CLICK_SET_KEY, 0, pasteId);
            return {
                id: pasteId,
                clicks: score
            };
        });

        const updateData = await Promise.all(updates);

        await prisma.$transaction(
            updateData.map((update) =>
                prisma.paste.update({
                    where: { id: update.id },
                    data: { numberOfClicks: { increment: update.clicks } }
                })
            )
        );

        await redisService.zremrangebyscore(
            CLICK_SET_KEY,
            '1',
            updateData[updateData.length - 1].clicks.toString()
        );
    }

    async startClickUpdatesWorker(): Promise<void> {
        setInterval(async () => {
            try {
                await this.processBatch();
            } catch (error) {
                console.error('Error processing click updates:', error);
            }
        }, UPDATE_INTERVAL);
    }
}

export const pasteClickService = new PasteClickService();
