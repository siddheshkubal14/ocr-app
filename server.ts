import http from 'http';
import createApp from './app.js';
import './workers/processor.js';
import dotenv from 'dotenv';
import { logger } from './logger/index.js';
import config from './config/index.js';

if ((process.env.NODE_ENV && process.env.NODE_ENV === 'local') ||
    !process.env.NODE_ENV) {
    const result = dotenv.config();
    if (result.error) {
        throw result.error;
    }
}


createApp()
    .then(app => {
        const server = http.createServer(app);

        server.listen(config.port, () => {
            const address = server.address();
            const port = typeof address === 'string' ? address : address?.port;
            logger.log('info', `Server running at port ${port}`, null);
        });

        server.on('error', (err) => {
            logger.log('error', 'Server error', err);
        });
    })
    .catch((err) => {
        logger.log('error', 'Failed to start app', err);
    });

