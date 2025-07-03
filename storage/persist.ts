import { getRedisClient } from './redisClient.js';
const client = getRedisClient();

export async function  saveDocument(id: string, data: any) {
    await client.json.set(`doc:${id}`, '$', data);
}

export async function getDocumentStatus(id: string) {
    return await client.json.get(`doc:${id}`);
}

export async function updateStatus(id: string, status: string, error?: string) {
    const exists = await client.exists(`doc:${id}`);
    if (!exists) {
        await client.json.set(`doc:${id}`, '$', { status, error: error || null });
    } else {
        await client.json.set(`doc:${id}`, '$.status', status);
        if (error) {
            await client.json.set(`doc:${id}`, '$.error', error);
        }
    }
}

