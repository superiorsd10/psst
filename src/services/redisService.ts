import { createClient, RedisClientType } from 'redis';
import config from '../config/config.js';

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

    /**
     * Gets the singleton instance of the RedisService.
     * @returns {RedisService} - The RedisService instance.
     */
    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    /**
     * Initializes the Redis client connection.
     * @returns {Promise<void>}
     */
    public async initialize(): Promise<void> {
        await this.client.connect();
    }

    /**
     * Returns the Redis client instance.
     * @returns {RedisClientType} - The Redis client.
     */
    public getClient(): RedisClientType {
        return this.client;
    }

    /**
     * Disconnects the Redis client.
     * @returns {Promise<void>}
     */
    public async disconnect(): Promise<void> {
        await this.client.disconnect();
    }

    /**
     * Gets the value associated with the given key from Redis.
     * @param {string} key - The key to fetch the value for.
     * @returns {Promise<string | null>} - The value associated with the key, or null if not found.
     */
    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    /**
     * Sets a value for the given key in Redis.
     * @param {string} key - The key to set the value for.
     * @param {string} value - The value to set.
     * @returns {Promise<void>}
     */
    async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    /**
     * Deletes the given key from Redis.
     * @param {string} key - The key to delete.
     * @returns {Promise<void>}
     */
    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    /**
     * Increments the score of a member in a sorted set by a given increment.
     * @param {string} key - The key of the sorted set.
     * @param {number} increment - The increment value.
     * @param {string} member - The member whose score is to be incremented.
     * @returns {Promise<number>} - The new score of the member.
     */
    async zincrby(
        key: string,
        increment: number,
        member: string
    ): Promise<number> {
        return await this.client.zIncrBy(key, increment, member);
    }

    /**
     * Retrieves members of a sorted set within the specified score range.
     * @param {string} key - The key of the sorted set.
     * @param {string} min - The minimum score.
     * @param {string} max - The maximum score.
     * @returns {Promise<string[]>} - An array of members within the score range.
     */
    async zrangebyscore(
        key: string,
        min: string,
        max: string
    ): Promise<string[]> {
        return await this.client.zRangeByScore(key, min, max);
    }

    /**
     * Removes members of a sorted set within the specified score range.
     * @param {string} key - The key of the sorted set.
     * @param {string} min - The minimum score.
     * @param {string} max - The maximum score.
     * @returns {Promise<number>} - The number of removed members.
     */
    async zremrangebyscore(
        key: string,
        min: string,
        max: string
    ): Promise<number> {
        return await this.client.zRemRangeByScore(key, min, max);
    }

    /**
     * Initiates a pipeline of commands for execution.
     * @returns {Promise<ReturnType<RedisClientType['multi']>>} - A pipeline object for batch command execution.
     */
    async pipeline(): Promise<ReturnType<RedisClientType['multi']>> {
        return this.client.multi();
    }
}

export const redisService = RedisService.getInstance();
