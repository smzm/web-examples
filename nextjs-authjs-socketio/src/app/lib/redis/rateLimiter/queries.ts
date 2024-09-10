import { redis } from '@/app/lib/redis/';
import getIp from './getIP';

interface RateLimiterRule {
  endpoint: string;
  rate_limit: {
    time: number;
    limit: number;
  };
}

export const rateLimiter = async ({
  endpoint,
  rate_limit: { time, limit },
}: RateLimiterRule) => {
  const ip = getIp();
  const key = `${endpoint}#${ip}`;

  const requests = await redis.incr(key);
  // expire key value after rate limit time if requests response is 1 or ok
  if (requests === 1) {
    await redis.expire(key, time);
  }

  // if number of requests is greater than rate limiter limit, return 429 status code
  if (requests > limit) {
    return {
      code: 429,
      success: false,
      error: 'Too many requests, try again later',
    };
  }

  // if number of requests is less than rate limiter limit, return null which means no error
  return { success: true };
};
