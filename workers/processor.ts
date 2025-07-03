import { Worker, Job, QueueEvents, Queue } from 'bullmq';
import { getIORedisClient } from '../storage/redisClient.js'
import fs from 'fs/promises';
import { simulateOCR } from '../ocr/simulateOCR.js';
import { extractMetadata } from '../metadata/extractMetadata.js';
import { InvoiceSchema } from '../validation/invoiceSchema.js';
import { saveDocument, updateStatus } from '../storage/persist.js';
import { DocumentStatus } from '../constants.js';
import { logger } from '../logger/index.js';



const connection = getIORedisClient();

// Dead Letter Queue to hold permanently failed jobs
const deadLetterQueue = new Queue('document-processing-dead', { connection });

export const processor = async (job: Job) => {
    const { docId, path, originalName } = job.data;

    try {
        await updateStatus(docId, DocumentStatus.Processing);

        const fileBuffer = await fs.readFile(path);
        const ocrResult = await simulateOCR(fileBuffer);
        const metadata = extractMetadata(ocrResult.text);

        // Validate metadata schema
        try {
            InvoiceSchema.parse(metadata);
        } catch (schemaErr: any) {
            throw new Error(`Validation failed: ${schemaErr.message}`);
        }

        await saveDocument(docId, {
            metadata,
            status: DocumentStatus.Validated,
            originalName,
            timestamps: { processedAt: new Date().toISOString() },
        });

        // Cleaning up uploaded file
        await fs.unlink(path);

        logger.log('info', `Document ${docId} processed successfully.`);
    } catch (error: any) {
        await updateStatus(docId, DocumentStatus.Failed, error.message);
        logger.log('error', `Failed processing ${docId}`, error);
        throw error; // To triggers retry if attempts left
    }
};

const worker = new Worker('document-processing', processor, { connection });

// Listen for failed jobs to handle dead letter logic
worker.on('failed', async (job, error) => {
    if (!job) {
        logger.log('error', 'Failed event triggered but job is undefined', error);
        return;
    }

    if (job.attemptsMade >= (job.opts.attempts ?? 0)) {
        logger.log('error', `Job ${job.id} failed after max retries. Moving to dead letter queue.`, error);

        // Moving job to dead letter queue for manual or later reprocessing
        await deadLetterQueue.add(job.name, job.data, { removeOnComplete: true });

        // removing the failed job from the original queue
        await job.remove();
    } else {
        logger.log('info', `Job ${job.id} failed on attempt ${job.attemptsMade}. Will retry.`);
    }
});

export default worker;
