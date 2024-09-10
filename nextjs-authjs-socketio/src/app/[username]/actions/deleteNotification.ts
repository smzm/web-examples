'use server';

import prisma from '@/app/lib/prisma';
import { delNotificationCache } from '@/app/lib/redis/message/queris';

export default async function deleteNotification({
  userId,
  conversationId,
}: {
  userId: string;
  conversationId: string;
}) {
  try {
    //  👉  Using postgresql Database
    // const d = await prisma.notification.deleteMany({
    //   where: { conversationId },
    // });

    //  👉  Using redis
    await delNotificationCache(userId, conversationId);
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: 'something wrong happen to delete notification',
    };
  }
}
