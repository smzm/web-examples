'use server';
import prisma from '@/app/lib/prisma';

export default async function getConversation({
  memberOneId,
  memberTwoId,
  conversationId,
}: {
  memberOneId?: string;
  memberTwoId?: string;
  conversationId?: string;
}) {
  let conversation = null;
  try {
    // If conversationId is provided, we will use it to find the conversation
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
        },
        include: {
          memberOne: true,
          memberTwo: true,
        },
      });
      // if conversationId is not provided, we will find the conversation by memberOneId and memberTwoId
    } else {
      conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            {
              AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
            },
            {
              AND: [{ memberOneId: memberTwoId }, { memberTwoId: memberOneId }],
            },
          ],
        },
        include: {
          memberOne: true,
          memberTwo: true,
        },
      });
    }
    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }
    return { success: true, conversation };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}
