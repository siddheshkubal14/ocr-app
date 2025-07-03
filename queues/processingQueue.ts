import { Queue } from 'bullmq';
import { getIORedisClient } from '../storage/redisClient.js'

const redisClient = getIORedisClient();

export const processingQueue = new Queue('document-processing', {
    connection: redisClient,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});

export const deadLetterQueue = new Queue('document-processing-dlq', {
    connection: redisClient,
});
