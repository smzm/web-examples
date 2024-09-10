'use client';
import {
  ElementRef,
  Fragment,
  startTransition,
  useEffect,
  useRef,
} from 'react';
import deleteNotification from '../../actions/deleteNotification';
import useChatQuery from '../../hooks/useChatQuery';
import useChatScroll from '../../hooks/useChatScroll';
import useChatSocket from '../../hooks/useChatSocket';
import { useNotification } from '../context/notificationProvider';

export default function ChatMessages({
  memberOneId,
  conversationId,
}: {
  memberOneId: string;
  conversationId: string;
}) {
  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const { notification, setNotification } = useNotification();
  useEffect(() => {
    startTransition(() => {
      if (notification.includes(conversationId)) {
        deleteNotification({ conversationId, userId: memberOneId }).then(
          (res) => {
            if (res.success) {
              setNotification((prev: any) => {
                prev = prev.filter((id: string) => id !== conversationId);
                return prev;
              });
            }
          },
        );
      }
    });
  }, [conversationId, setNotification, notification, memberOneId]);

  // use chat query to get all messages of a conversation id
  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChatQuery({
      conversationId,
    });

  // use chat scroll to automatically scroll to the bottom of the chat
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.messages?.length ?? 0,
  });

  // use chat socket to listen to new messages
  useChatSocket({ conversationId });
  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        Something went wrong!
      </div>
    );
  }

  // infinit scroll to load more messages when user scroll to the top
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (
      -1 * target.scrollTop + 10 >=
      target.scrollHeight - target.clientHeight
    ) {
      fetchNextPage();
    }
  };

  return (
    <div
      className="mx-auto flex h-full w-full grow flex-col overflow-y-auto p-2"
      ref={chatRef}
    >
      <div
        className="flex h-full flex-col-reverse overflow-y-auto "
        onScroll={handleScroll}
      >
        {data?.pages?.map((group, i) => {
          return (
            <Fragment key={i}>
              {group?.messages?.map((message, j) => {
                if (message.senderId === memberOneId) {
                  return (
                    <div
                      key={j}
                      className="m-1 self-end rounded-2xl bg-emerald-500 p-4 text-white"
                    >
                      {message.content}
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="m-1 self-start rounded-2xl bg-blue-500 p-4 text-white"
                      key={j}
                    >
                      {message.content}
                    </div>
                  );
                }
              })}
            </Fragment>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
