'use client';

import Button from '@/app/components/AtomicUI/Button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function SignupWithEmail() {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  // if user is authenticated but doesn't have profile (Oauth first register)
  if (!session?.user.profile && status === 'authenticated') {
    redirect('/account/signup/completion');
  }

  return (
    <div className="flex flex-col space-y-4">
      <Link href="/account/signup/email">
        <Button
          variant="primary"
          color="night"
          size="large"
          className="text-base"
        >
          Continue with email
        </Button>
      </Link>

      <Link href="/account/signup/phonenumber">
        <Button
          variant="primary"
          color="night"
          size="large"
          className="text-base"
        >
          Continue with phone number
        </Button>
      </Link>
    </div>
  );
}
