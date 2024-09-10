import { redis } from '@/app/lib/redis';
import { notificationKey } from './../keys';

export const setNotificationCache = async (
  userId: string,
  conversationId: string,
) => {
  return await redis.sadd(notificationKey(userId), conversationId);
};

export const getNotificationCache = async (userId: string) => {
  const notifications = await redis.smembers(notificationKey(userId));
  if (Object.keys(notifications).length === 0) return [''];
  return notifications;
};

export const delNotificationCache = async (
  userId: string,
  conversationId: string,
) => {
  return await redis.srem(notificationKey(userId), conversationId);
};
