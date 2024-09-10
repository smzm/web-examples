import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSocket } from '../components/socket/Socket-Provider';

export default function useChatSocket({
  conversationId,
}: {
  conversationId: string;
}) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    // listen to socket event for new message
    socket.on(conversationId, (message: any) => {
      queryClient.setQueryData(
        ['directMessages', conversationId],
        (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0)
            return oldData;

          const newData = oldData.pages.map((page: any) => {
            return {
              ...page,
              messages: [message, ...page.messages],
            };
          });

          return {
            ...oldData,
            pages: newData,
          };
        },
      );
    });
    return () => {
      socket.off(conversationId);
    };
  }, [conversationId, queryClient, socket]);
}
