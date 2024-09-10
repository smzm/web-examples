'use client';
import { loginByPhoneNumber } from '@/app/actions/authentication/login/loginByPhoneNumber';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { TTwoFactorSchema, twoFactorSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

export function PhoneVerificationForm({ identifier }: { identifier: string }) {
  const [signInError, setSignInError] = useState<string>('');
  const [isWaiting, setIsWaiting] = useState(false);

  // RHF + Zod Type
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TTwoFactorSchema>({
    resolver: zodResolver(twoFactorSchema),
  });

  // handle submit verification token
  function handleVerificationToken(data: TTwoFactorSchema) {
    setSignInError('');
    setIsWaiting(true);

    startTransition(() => {
      if (identifier) {
        loginByPhoneNumber({
          PhoneNumber: { phoneNumber: identifier },
          Token: data,
        }).then((res) => {
          if (res?.error) {
            setSignInError(res?.error);
          }
        });
      }
      setIsWaiting(false);
    });
  }

  return (
    <div>
      <div className="my-4">
        <form onSubmit={handleSubmit(handleVerificationToken)}>
          <InputField
            label="Enter Code Sent to Your Phone"
            name="token"
            errors={
              errors.token?.message
                ? errors
                : { token: { message: signInError } }
            }
            register={register}
            onChangeCallback={() => setSignInError('')}
          />
          <Button
            size="large"
            color="night"
            variant="primary"
            className="my-4"
            waiting={isWaiting}
          >
            Sign in
          </Button>
        </form>
      </div>
      <p className="mt-2 px-2 text-base font-medium text-night-400">
        Don't have an account?{' '}
        <Link
          href="/account/signup"
          className="cursor-pointer text-base font-normal text-night-300 underline transition hover:text-night-200"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
