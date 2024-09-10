import prisma from '@/app/lib/prisma';

export default async function makeConversationSeen({
  loggedInUserId,
  memberTwoId,
  id,
}: {
  loggedInUserId: string;
  memberTwoId: string;
  id: string;
}) {
  if (loggedInUserId !== memberTwoId) {
    await prisma.conversation.update({
      where: {
        id,
      },
      data: {
        isSeen: true,
      },
    });
  }
}
