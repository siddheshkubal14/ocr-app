import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveDocument } from '../storage/persist.js';
import { processingQueue } from '../queues/processingQueue.js';
import { DocumentStatus, ERROR_MESSAGES } from '../constants.js';
import { logger } from '../logger/index.js';

export const uploadHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ error: ERROR_MESSAGES.FILE_REQUIRED });
        return;
    }

    const docId = uuidv4();
    const filePath = req.file.path;

    try {
        await saveDocument(docId, {
            status: DocumentStatus.Uploaded,
            originalName: req.file.originalname,
            file_path: filePath,
            timestamps: { uploadedAt: new Date().toISOString() },
            metadata: {},
            error: null
        });

        await processingQueue.add('process-doc', {
            docId,
            path: filePath,
            originalName: req.file.originalname
        });

        logger.log('info', `Document ${docId} uploaded and queued for processing`);

        res.status(200).json({ documentId: docId, status: DocumentStatus.Uploaded });
    } catch (error: any) {
        logger.log('error', 'file upload error:', error);
        next(error);
    }
};
