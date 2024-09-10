'use server';
import prisma from '@/app/lib/prisma';

export default async function getAllConversations({
  memberId,
}: {
  memberId: string;
}) {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ memberOneId: memberId }, { memberTwoId: memberId }],
    },
    include: {
      memberOne: true,
      memberTwo: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  if (!conversations) return null;
  return { conversations };
}
