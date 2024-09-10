'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function CheckProfileExist({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const profile = session?.user.profile;

  if (status === 'authenticated' && !profile) {
    redirect('/account/signup/completion');
  }
  return <> {children} </>;
}
