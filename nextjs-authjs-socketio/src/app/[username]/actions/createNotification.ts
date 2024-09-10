'use server';
import prisma from '@/app/lib/prisma';
import { setNotificationCache } from '@/app/lib/redis/message/queris';

export default async function createNotification({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  try {
    //  👉  Using postgresql Database
    // await prisma.notification.create({
    //   data: {
    //     conversationId: conversationId,
    //     userId: userId,
    //   },
    // });
    // 👉 using redis
    await setNotificationCache(userId, conversationId);
    return { success: true };
  } catch (e) {
    return {
      success: true,
      error: 'something wrong happen to create notification',
    };
  }
}
