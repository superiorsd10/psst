import { createClient, RedisClientType } from 'redis';
import config from '../config/config';

class RedisService {
    private static instance: RedisService;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient({
            url: config.redisUrl
        });

        this.client.on('error', (error) => {
            console.error('Redis Client Error', error);
        });

        this.client.on('connect', () => console.info('Redis Client Connected'));
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    public async initialize(): Promise<void> {
        await this.client.connect();
    }

    public getClient(): RedisClientType {
        return this.client;
    }

    public async disconnect(): Promise<void> {
        await this.client.disconnect();
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async zincrby(
        key: string,
        increment: number,
        member: string
    ): Promise<number> {
        return await this.client.zIncrBy(key, increment, member);
    }

    async zrangebyscore(
        key: string,
        min: string,
        max: string
    ): Promise<string[]> {
        return await this.client.zRangeByScore(key, min, max);
    }

    async zremrangebyscore(
        key: string,
        min: string,
        max: string
    ): Promise<number> {
        return await this.client.zRemRangeByScore(key, min, max);
    }

    async pipeline(): Promise<ReturnType<RedisClientType['multi']>> {
        return this.client.multi();
    }
}

export const redisService = RedisService.getInstance();
