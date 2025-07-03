import express from 'express';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import routes from './api/index.js';
import rateLimit from 'express-rate-limit';
import { ERROR_MESSAGES, whitelistedURL } from './constants.js';
import { authMiddleware } from './middlewares/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './logger/index.js';


export default async () => {
    const app = express();


    const corsOptions: CorsOptions = {
        origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
            if (!origin || whitelistedURL.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: ERROR_MESSAGES.TOO_MANY_REQUESTS
    });
    app.use(limiter);

    const router = express.Router();

    router.get('/healthcheck', (req, res) => {
        res.status(200).json({ message: 'healthy' });
    });

    router.use(authMiddleware);
    router.use(errorHandler);
    router.use('/', routes());
    app.use('/', router);

    return app;
};

process.on('uncaughtException', (error) => {
    logger.log('error', 'Uncaught Exception', error);
});
