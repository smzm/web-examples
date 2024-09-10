import { Redis } from 'ioredis';

const getRedisUrl = () => {
  // only available in server side
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw new Error('REDIS_URL is not defined');
};

export const redis = new Redis(getRedisUrl());
