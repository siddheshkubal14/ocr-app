import { Worker, Job, Queue } from 'bullmq';
import { getIORedisClient } from '../storage/redisClient.js';
import fs from 'fs/promises';
import { simulateOCR } from '../ocr/simulateOCR.js';
import { extractMetadata } from '../metadata/extractMetadata.js';
import { InvoiceSchema } from '../validation/invoiceSchema.js';
import { saveDocument, updateStatus, getDocument } from '../storage/persist.js';
import { DocumentStatus, OCRConfidenceThreshold } from '../constants.js';
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

        if (ocrResult.confidence > OCRConfidenceThreshold) {
            const metadata = extractMetadata(ocrResult.text);

            // Validate metadata schema
            try {
                InvoiceSchema.parse(metadata);
            } catch (schemaErr: any) {
                throw new Error(`Validation failed: ${schemaErr.message}`);
            }

            // Getting existing document (to preserve file_path & uploadedAt)
            const existing = await getDocument(docId);
            const uploadedAt = existing?.timestamps?.uploadedAt || new Date().toISOString();
            const file_path = existing?.file_path || path;

            await saveDocument(docId, {
                metadata,
                status: DocumentStatus.Validated,
                originalName,
                file_path,
                timestamps: {
                    uploadedAt,
                    processedAt: new Date().toISOString()
                }
            });

            logger.log('info', `Document ${docId} processed successfully.`);
        } else {
            await updateStatus(docId, DocumentStatus.Failed, 'Failed due to low OCR confidence. Manual verification needed.');
        }
    } catch (error: any) {
        await updateStatus(docId, DocumentStatus.Failed, error.message);
        logger.log('error', `Failed processing ${docId}`, error);
        throw error; // Trigger retry if attempts remain
    }
};

const worker = new Worker('document-processing', processor, { connection });

// Handling job failures and move to dead letter queue if retries are exhausted
worker.on('failed', async (job, error) => {
    if (!job) {
        logger.log('error', 'Failed event triggered but job is undefined', error);
        return;
    }

    if (job.attemptsMade >= (job.opts.attempts ?? 0)) {
        logger.log('error', `Job ${job.id} failed after max retries. Moving to dead letter queue.`, error);

        await deadLetterQueue.add(job.name, job.data, { removeOnComplete: true });
        await job.remove();
    } else {
        logger.log('info', `Job ${job.id} failed on attempt ${job.attemptsMade}. Will retry.`);
    }
});

export default worker;
