import { getRedisClient } from './redisClient.js';
const client = getRedisClient();
interface StoredDocument {
    metadata: Record<string, any>;
    status: string;
    originalName: string;
    file_path: string;
    timestamps: {
        uploadedAt: string;
        processedAt?: string;
    };
    error?: string | null;
}


/**
 * Save a new document to Redis with full structured data
 */
export async function saveDocument(id: string, data: {
    status: string;
    originalName: string;
    file_path: string;
    timestamps: {
        uploadedAt: string;
        processedAt?: string;
    };
    metadata: Record<string, any>;
    error?: string | null;
}) {
    await client.json.set(`doc:${id}`, '$', data);
}

/**
 * Retrieve the full document data from Redis
 */
export async function getDocument(id: string): Promise<StoredDocument | null> {
    const raw = await client.json.get(`doc:${id}`);
    return raw as StoredDocument | null;
}

/**
 * Retrieve just the status from Redis
 */
export async function getDocumentStatus(id: string) {
    return await client.json.get(`doc:${id}`, { path: '$.status' });
}

/**
 * Update document status (and error, if provided)
 */
export async function updateStatus(id: string, status: string, error?: string) {
    const key = `doc:${id}`;
    const exists = await client.exists(key);

    if (!exists) {
        // Save a minimal doc if not exists
        await client.json.set(key, '$', {
            status,
            error: error || null,
            metadata: {},
            originalName: '',
            file_path: '',
            timestamps: { uploadedAt: new Date().toISOString() }
        });
    } else {
        await client.json.set(key, '$.status', status);
        if (error) {
            await client.json.set(key, '$.error', error);
        }
    }
}


