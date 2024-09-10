import { auth } from '@/app/lib/authentication/auth';
import { redirect } from 'next/navigation';
import Follow from '../components/UI/Follow';
import checkUsername from './actions/checkUsername';
import Avatar from '../components/UI/Avatar';

export default async function UserPage({
  params: { username },
}: {
  params: { username: string };
}) {
  const session = await auth();
  if (!session) {
    redirect('/account/login');
  }

  const user = await checkUsername({ username });
  if (!user.success) {
    return <div>404</div>;
  }
  const name = user.user?.name;

  if (username === session.user.username) {
    redirect('/account/profile');
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-1/3">
        <Avatar user={user.user} />
        <Follow username={username} />
      </div>
    </div>
  );
}
