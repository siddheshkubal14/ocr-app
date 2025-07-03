import express from 'express';
import uploadRoutes from './upload.js';

const router = express.Router();

export default () => {
    router.use('/upload', uploadRoutes());
    return router;
};
