'use server';

import { getNotificationCache } from '@/app/lib/redis/message/queris';

export default async function getNotification({ userId }: { userId: string }) {
  try {
    //  👉  Using postgresql Database
    // const notifications = await prisma.notification.findMany({
    //   where: {
    //     userId: userId,
    //   },
    // });

    //  👉  Using postgresql Database
    const notifications = await getNotificationCache(userId);
    return { notifications, error: null };
  } catch (e) {
    return {
      notifications: null,
      error: 'something wrong happen to get notification',
    };
  }
}
