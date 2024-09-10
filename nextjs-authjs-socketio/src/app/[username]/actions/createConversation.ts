'use server';
import prisma from '@/app/lib/prisma';

export default async function createConversation({
  memberOneId,
  memberTwoId,
}: {
  memberOneId?: string;
  memberTwoId?: string;
}) {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        memberOne: {
          connect: {
            id: memberOneId,
          },
        },
        memberTwo: {
          connect: {
            id: memberTwoId,
          },
        },
      },
    });

    return { success: true, conversation };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}
