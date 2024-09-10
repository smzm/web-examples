import { auth } from '@/app/lib/authentication/auth';
import { getUserByUsername } from '@/app/lib/data/user';
import { setNotificationCache } from '@/app/lib/redis/message/queris';
import createConversation from '../actions/createConversation';
import getAllConversations from '../actions/getAllConversations';
import getConversation from '../actions/getConversation';
import getNotification from '../actions/getNotification';
import ChatInput from '../components/chat/chat-Input';
import ChatConversations from '../components/chat/chat-conversations';
import ChatMessages from '../components/chat/chat-messages';
import NotificationProvider from '../components/context/notificationProvider';
import { SocketIndicator } from '../components/socket/Socket-Indicator';
export default async function Message({
  params: { username },
}: {
  params: { username: string };
}) {
  // get member one data : the user who is logged in
  const session = await auth();
  const memberOne = session?.user;
  if (!memberOne) return null;

  // get member two data : the user who get message
  const memberTwo = await getUserByUsername({ username });
  if (!memberTwo) return null;

  // Create a conversation between member one and member two
  let conversation;
  const conversationResult = await getConversation({
    memberOneId: memberOne.id,
    memberTwoId: memberTwo.id,
  });
  conversation = conversationResult?.conversation;
  if (!conversation) {
    const conversationResult = await createConversation({
      memberOneId: memberOne.id,
      memberTwoId: memberTwo.id,
    });
    conversation = conversationResult?.conversation;
  }
  const memberOneUsername = memberOne.username;
  const memberTwoUsername = memberTwo.username;
  if (!memberOneUsername || !memberTwoUsername) return null;

  if (!conversation) return <div> There is no conversation</div>;

  // get all conversations of member one
  const conversationsResult = await getAllConversations({
    memberId: memberOne.id,
  });
  const conversations = conversationsResult?.conversations;
  let allConversations: any = conversations;

  // get all notifications
  const notificationsResult = await getNotification({ userId: memberOne.id });
  if (!notificationsResult.notifications) {
    return null;
  }
  const notifications = notificationsResult.notifications;

  return (
    <div className="flex h-screen flex-col">
      <div>
        <SocketIndicator />
      </div>

      <div className="flex grow overflow-y-auto">
        <NotificationProvider notifications={notifications}>
          <ChatConversations
            username={username}
            conversations={allConversations}
          />
          <ChatMessages
            memberOneId={memberOne.id}
            conversationId={conversation.id}
          />
        </NotificationProvider>
      </div>
      <div className="w-full px-4">
        <ChatInput />
      </div>
    </div>
  );
}
