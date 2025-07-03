interface Config {
    redisUrl?: string;
    apiKey?: string;
    port: number;
}

const config: Record<string, Config> = {
    development: {
        redisUrl: process.env.REDIS_URL,
        apiKey: process.env.API_KEY,
        port: Number(process.env.PORT) || 3000,
    }
};

const env = process.env.NODE_ENV || 'development';

export default config[env];
