import { Event } from '@prisma/client';
import { prisma, redis } from '@/config';
import { eventCacheKey, secondsToExpireCache } from '@/utils/constants/redis';

async function findFirst() {
  const cachedEvent = await redis.get(eventCacheKey);
  if (cachedEvent) return JSON.parse(cachedEvent) as Event;

  const event = await prisma.event.findFirst();
  await redis.setEx(eventCacheKey, secondsToExpireCache, JSON.stringify(event));
  return event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
