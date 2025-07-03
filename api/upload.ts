import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadHandler } from '../handlers/uploadHandler.js';
import { ERROR_MESSAGES, allowedMimeTypes, fileSizeLimit, allowedExtensions } from '../constants.js';

const router = express.Router();

const uploadMiddleware = multer({
    dest: 'uploads/',
    limits: { fileSize: fileSizeLimit },
    fileFilter: (req, file, cb) => {
        try {
            const ext = path.extname(file.originalname).toLowerCase();
            if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
                return cb(new Error(ERROR_MESSAGES.INVALID_FILE_TYPE));
            }
            cb(null, true);
        } catch (err) {
            cb(err as Error);
        }
    },
});

export default () => {
    router.post('/', uploadMiddleware.single('file'), uploadHandler);
    return router;
};
