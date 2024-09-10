'use client';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function GoogleSignin() {
  const path = useSearchParams();
  const error = path?.get('error');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!(status === 'loading') && !session) {
      signIn('google');
    }
    if (session) window.close();
  }, [session, status]);

  // if (!session && error) {
  //   window.close();
  // }

  return (
    <div className="absolute left-0 top-0 h-full w-full bg-white">
      {status === 'unauthenticated' ? (
        <div className="m-4 text-gray-400">
          You will be redirect to Google...
        </div>
      ) : status === 'loading' ? (
        <div className="m-4 text-gray-400">Loading...</div>
      ) : (
        <div className="m-4 text-gray-400">You are logged in.</div>
      )}
    </div>
  );
}
