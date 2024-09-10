'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { startTransition, useCallback, useEffect } from 'react';
import createNotification from '../../actions/createNotification';
import { useNotification } from '../context/notificationProvider';
import { useSocket } from '../socket/Socket-Provider';

export default function ChatConversations({
  username,
  conversations,
}: {
  username: string;
  conversations: any;
}) {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const { notification, setNotification } = useNotification();
  const userId = session?.user.id;

  // listen to the socket to notify when get the new message
  const submitNotification = useCallback(
    ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      createNotification({ conversationId, userId }).then((res) => {
        if (res.success) {
          setNotification((prev: any) => {
            if (!prev.some((id: string) => id === conversationId)) {
              return [...prev, conversationId];
            }
            return prev;
          });
        }
      });
    },
    [setNotification],
  );
  useEffect(() => {
    // socket sent the conversation id to receiver id which in here we can check is it the user id session or not
    if (!userId) {
      return;
    }
    socket.on(userId, (data: any) => {
      const { conversationId, senderUsername } = data;
      if (conversationId) {
        if (
          notification.some((id: any) => id === conversationId) ||
          username === senderUsername
        ) {
          return;
        }
        startTransition(() => {
          submitNotification({ conversationId, userId });
        });
      }
    });

    return () => {
      socket.off(userId);
    };
  }, [session, socket, submitNotification, userId, notification, username]);

  return (
    <div className="w-96 bg-neutral-200">
      {conversations?.map((conversation: any, i: number) => {
        return (
          <div
            key={i}
            className="mx-2 my-4 cursor-pointer rounded-lg bg-neutral-400 p-2"
          >
            <Link
              className="flex"
              href={`/${
                conversation.memberTwo?.id === session?.user.id
                  ? conversation.memberOne?.username
                  : conversation.memberTwo?.username
              }/message`}
            >
              <Image
                width={300}
                height={300}
                src={conversation.memberTwo?.image || ''}
                alt="avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col items-center justify-center">
                <div className="text-white">
                  {conversation.memberTwo?.id === session?.user.id
                    ? conversation.memberOne?.name
                    : conversation.memberTwo?.name}
                </div>
                <div className="mx-2 text-sm text-neutral-500">
                  {conversation.memberTwo?.id === session?.user.id
                    ? conversation.memberOne?.username
                    : conversation.memberTwo?.username}
                </div>
                {notification.includes(conversation.id) &&
                !conversation.isSeen ? (
                  <div className="text-sm text-red-500">New</div>
                ) : null}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
