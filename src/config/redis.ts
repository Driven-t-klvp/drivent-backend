import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL,
});

export async function connectRedis() {
  redis.on('error', (err) => console.log('Redis Client Error: ', err));
  await redis.connect();
}
