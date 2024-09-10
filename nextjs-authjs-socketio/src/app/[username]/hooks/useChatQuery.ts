'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getMessages } from '../actions/getMessages';
import { useSocket } from '../components/socket/Socket-Provider';

export default function useChatQuery({
  conversationId,
}: {
  conversationId: string;
}) {
  // const { data, isFetched, status } = useQuery({
  //   queryKey: ['directMessages', conversationId],
  //   queryFn: async () => getMessages({ conversationId, cursor: '' }),
  // });

  const { isConnected } = useSocket();

  async function fetchMessages({ pageParam = undefined }) {
    return await getMessages({ conversationId, cursor: pageParam });
  }

  // use infinite query to get messages of a conversation
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['directMessages', conversationId],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
      refetchInterval: isConnected ? false : 1000,
    });

  return { data, status, fetchNextPage, hasNextPage, isFetchingNextPage };
}
