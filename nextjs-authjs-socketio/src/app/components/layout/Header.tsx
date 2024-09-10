import { Session } from 'next-auth/types';
import Link from 'next/link';
import Avatar from '../UI/Avatar';

export default function Header({ session }: { session: Session }) {
  return (
    <div className="flex h-20 w-full justify-end">
      <Link href="/account/profile" className="mx-8 my-2">
        <Avatar user={session.user} />
      </Link>
    </div>
  );
}
