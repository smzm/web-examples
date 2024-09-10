'use client';
import validateEmailVerificationToken from '@/app/actions/authentication/email/validateEmailVerificationToken';
import Button from '@/app/components/AtomicUI/Button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { startTransition, useCallback, useEffect, useState } from 'react';

export default function VerifyToken() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
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
        .then((res) => {
          if (res.error) {
            setErr(res.error);
            return;
          }
          setSuccess(res.success);
        })
        .catch((err) => {
          setErr('Something went wrong');
        });
    });
  }, [token, success, err]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div>
      {!err && !success ? (
        <p className="my-4 w-full rounded-lg bg-gray-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          Loading...
        </p>
      ) : null}

      <div className="flex w-full flex-col">
        {!success && err ? (
          <p className="rounded-xl bg-red-600 p-2 text-center text-base font-semibold  leading-loose tracking-wider text-white">
            {err}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-xl bg-green-600 p-2 text-center text-base font-semibold  leading-loose tracking-wider text-white">
            {success}
          </p>
        ) : null}

        <Button size="large" variant="primary" color="night" className="mt-4">
          <Link href="/account/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
