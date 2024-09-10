'use client';
import validateEmailVerificationToken from '@/app/actions/authentication/email/validateEmailVerificationToken';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { startTransition, useCallback, useEffect, useState } from 'react';

export default function VerifyToken() {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [err, setErr] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (success || err) return;

    startTransition(() => {
      if (!token) {
        setErr('Token is not valid');
        return;
      }
      validateEmailVerificationToken(token)
        .then(async (res) => {
          if (res.error) {
            setErr(res.error);
            return;
          }
          setSuccess(res.success);
          update();
        })
        .catch((err) => {
          setErr('Something went wrong');
        });
    });
  }, [token, success, err, update]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="">
      {!err && !success ? (
        <p className="my-4 w-full rounded-lg bg-gray-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          Loading...
        </p>
      ) : null}

      {!success && err ? (
        <p className="my-4 w-full rounded-lg bg-red-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          {err}
        </p>
      ) : null}
      {success ? (
        <div className="my-4 w-full rounded-lg bg-green-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          <p>{success}</p>
        </div>
      ) : null}
      <button
        className="cursor-pointer underline"
        onClick={() => window.location.replace('/account/profile')}
      >
        Back to Profile
      </button>
    </div>
  );
}
