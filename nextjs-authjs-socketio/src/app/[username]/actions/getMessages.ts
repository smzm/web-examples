'use server';
import prisma from '@/app/lib/prisma';
import { Message } from '@prisma/client';

export async function getMessages({
  conversationId,
  cursor,
}: {
  conversationId: string | null;
  cursor: string | undefined;
}) {
  const message_batch_size = 20;
  try {
    if (!conversationId) {
      return { messages: [], nextCursor: null };
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await prisma.message.findMany({
        take: message_batch_size,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = await prisma.message.findMany({
        take: message_batch_size,
        where: {
          conversationId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // in there any message unread
    let nextCursor = null;
    if (messages.length === message_batch_size) {
      nextCursor = messages[messages.length - 1].id;
    }

    return {
      messages,
      nextCursor,
    };
  } catch (error) {
    console.log('Error:', error);
    return { error };
  }
}
