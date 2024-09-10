import { Session } from 'next-auth/types';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '../../lib/authentication/auth';

export default async function ProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session)
    return (
      <div>
        <div>Not Signed In</div>
        <Link href="/account/login">Login</Link>
      </div>
    );

  const { id, name } = session?.user;
  if (!id) return <div> not signed in</div>;
  if (!name) redirect('/account/profile');
  return <> {children} </>;
}
