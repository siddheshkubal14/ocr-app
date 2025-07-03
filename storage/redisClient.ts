import { createClient, RedisClientType } from 'redis';
import Redis from 'ioredis';
import { logger } from '../logger/index.js';
import dotenv from 'dotenv';
dotenv.config();

let redisClient: RedisClientType | null = null;
export function getRedisClient(): RedisClientType {
    if (!redisClient) {
        redisClient = createClient({
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries >= 5) return false;
                    logger.log('info', 'Redis retry attempt', retries);
                    return Math.min(retries * 50, 2000);
                },
            },
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        });

        redisClient.on('error', (error) => logger.log('error', 'redis error', error));

        redisClient.connect().catch((error) => {
            logger.log('error', 'Redis Connection Failed', error);
        });
    }

    return redisClient;
}


let ioRedisClient: Redis | null = null;
export function getIORedisClient(): Redis {
    if (!ioRedisClient) {
        ioRedisClient = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            maxRetriesPerRequest: null,
        });

        ioRedisClient.on('error', (err) => {
            console.error('[REDIS ERROR]', err);
        });
    }

    return ioRedisClient;
}


