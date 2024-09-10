'use server';
import { auth } from '@/app/lib/authentication/auth';
import { getUserByUsername } from '@/app/lib/data/user';
import prisma from '@/app/lib/prisma';
import { setNotificationCache } from '@/app/lib/redis/message/queris';
import { TMessageSchema, messageSchema } from '@/app/types/message';
import { revalidatePath } from 'next/cache';
import { default as createConversation } from './createConversation';
import getConversation from './getConversation';

export default async function submitMessage({
  Message,
  receiverUsername,
}: {
  Message: TMessageSchema;
  receiverUsername: string;
}) {
  // zod validation
  const messageValidation = messageSchema.safeParse(Message);
  if (!messageValidation.success) {
    return {
      success: false,
      error: messageValidation.error.errors[0].message,
    };
  }

  const session = await auth();
  const senderUsername = session?.user?.username;
  if (!senderUsername) {
    return {
      success: false,
      error: 'Not authenticated',
    };
  }

  const sender = await getUserByUsername({ username: senderUsername });
  if (!sender) {
    return {
      success: false,
      error: 'User not found',
    };
  }

  const receiver = await getUserByUsername({ username: receiverUsername });
  if (!receiver) {
    return {
      success: false,
      error: 'Recipient not found',
    };
  }
  const content = Message.content;

  // database query
  let conversation;
  const conversationExist = await getConversation({
    memberOneId: sender.id,
    memberTwoId: receiver.id,
  });
  if (!conversationExist.success) {
    const conversationResult = await createConversation({
      memberOneId: sender.id,
      memberTwoId: receiver.id,
    });
    if (!conversationResult.success) {
      return {
        success: false,
        error: 'Conversation Issue',
      };
    }
    conversation = conversationResult.conversation;
  } else {
    conversation = conversationExist.conversation;
    // after finding the conversation, we will update the updatedAt field
    await prisma.conversation.update({
      where: {
        id: conversation?.id,
      },
      data: {
        updatedAt: new Date(),
        isSeen: false,
      },
    });
  }

  if (!conversation?.id) {
    return {
      success: false,
      error: 'Conversation not found',
    };
  }
  const message = await prisma.message.create({
    data: {
      content,
      conversationId: conversation.id,
      senderId: sender.id,
    },
  });

  // Todo: it should be private in route and send token to verify it's logged in
  const res = await fetch(
    `http://localhost:3900/api/socket/direct-message?conversationId=${conversation.id}&receiverId=${receiver.id}&senderUsername=${sender.username}`,
    {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  // submit notification to redis
  await setNotificationCache(receiver.id, conversation.id);

  revalidatePath(`/[username]/message/`, 'layout');

  return {
    success: true,
    message,
  };
}
