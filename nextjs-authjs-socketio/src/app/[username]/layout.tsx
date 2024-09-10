import { SessionProvider } from '@/app/components/contexts/session';
import checkUsername from './actions/checkUsername';
import QueryProvider from './components/react-query/QueryProvider';
import { SocketProvider } from './components/socket/Socket-Provider';

export default async function layout({
  children,
  params: { username },
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const user = await checkUsername({ username });
  if (!user.success) {
    return <div>404</div>;
  }
  return (
    <SocketProvider>
      <QueryProvider>
        <SessionProvider>{children}</SessionProvider>
      </QueryProvider>
    </SocketProvider>
  );
}
