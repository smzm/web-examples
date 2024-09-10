'use client';
import { sendEmailVerificationToken } from '@/app/actions/authentication/email/sendEmailVerificationToken';
import { loginByCredentials } from '@/app/actions/authentication/login/loginByCredentials';
import Button from '@/app/components/AtomicUI/Button';
import { PasswordField } from '@/app/components/AtomicUI/InputField';
import { TPasswordSchema, passwordSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useOptimistic, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IdentifierTypes } from '../page';

export default function PasswordVerificationForm({
  identifier,
  identifierType,
}: any) {
  const [signInError, setSignInError] = useState<string | undefined>(undefined);
  const [notVerified, setNotverified] = useState<any>({
    value: false,
    message: '',
    state: '',
  });
  const [notVerfiedMessage, setNotverifiedMessage] = useOptimistic(
    notVerified,
    (result: any, optimisticResult: any) => {
      return optimisticResult;
    },
  );

  const [isWaiting, setIsWaiting] = useState(false);

  // RHF + Zod Type
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<TPasswordSchema>({
    resolver: zodResolver(passwordSchema),
  });

  const router = useRouter();

  // handle submit with password
  async function handleSignIn(data: TPasswordSchema) {
    setNotverified({ value: false, message: '' });
    setIsWaiting(true);
    if (
      identifierType === IdentifierTypes.Email ||
      identifierType === IdentifierTypes.Username
    ) {
      startTransition(() => {
        loginByCredentials({ identifier, password: data.password }).then(
          (response) => {
            if (response?.error) {
              if (response.details === 'email-not-verified') {
                setNotverified({
                  value: true,
                  message: [
                    'Your email is not verified',
                    "didn't receive verification link? \nClick here to send again.",
                  ],
                  state: 'error',
                });
                return;
              }
              setSignInError(response?.error);
            }
          },
        );
      });
    }
  }

  // handle send verification token again for notVerified email
  async function handleVerification() {
    startTransition(() => {
      if (!identifier) return;
      setNotverifiedMessage({
        value: true,
        message: ['Sending verification email again...'],
        state: 'waiting',
      });
      sendEmailVerificationToken({
        id: null,
        identifier,
        name: null,
        type: 'signup',
        redirectPath: '/account/email/verify',
      }).then((response) => {
        if (!response || response.error) {
          setNotverified({
            value: true,
            messag: [
              'Something went wrong in sending new verification link to your email address.\ntry again later',
            ],
            state: 'error',
          });
        } else {
          setNotverified({
            value: true,
            message: [
              'Verfication link sent to your email address again.\nCheck your spam folder if you still don’t see it.',
            ],
            state: 'success',
          });
        }
      });
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col">
        <PasswordField
          label="Password"
          register={register}
          control={control}
          passwordStrengthMeter={false}
          onChangeCallback={() => setSignInError(undefined)}
          errors={errors}
        />

        <Button
          size="large"
          variant="primary"
          color="night"
          waiting={isWaiting}
          className="my-4"
        >
          Sign In
        </Button>
      </form>
      <Link
        href="/account/password/forgot"
        className="cursor-pointer px-2 text-base font-normal text-night-400 transition hover:text-night-100"
      >
        Forgot your password?
      </Link>
      <p className="mt-2 px-2 text-base font-medium text-night-400">
        Don't have an account?{' '}
        <Link
          href="/account/signup"
          className="cursor-pointer text-base font-normal text-night-300 underline transition hover:text-night-200"
        >
          Sign up
        </Link>
      </p>

      {signInError && (
        <p className="mt-12 rounded-xl  bg-red-600 p-2 text-center text-base  font-normal tracking-wide text-neutral-100">
          {signInError}
        </p>
      )}

      {notVerfiedMessage.value && (
        <form action={handleVerification}>
          <p
            className={clsx(
              `mt-10 w-full whitespace-pre-wrap rounded-lg p-2 text-center text-base font-normal tracking-wide text-white`,
              {
                'bg-neutral-950 p-4 text-neutral-100':
                  notVerfiedMessage.state === 'waiting',
                'bg-red-500': notVerfiedMessage.state === 'error',
                'bg-green-600 p-3 text-sm font-normal':
                  notVerfiedMessage.state === 'success',
              },
            )}
          >
            {notVerfiedMessage.message[0]}
          </p>
          {notVerfiedMessage.message[1] && (
            <button
              type="submit"
              className="mt-4 w-full cursor-pointer whitespace-pre-wrap rounded-b-lg text-center  text-sm font-normal tracking-wide text-red-500 transition-all hover:text-red-400"
            >
              {notVerfiedMessage.message[1]}
            </button>
          )}
        </form>
      )}
    </div>
  );
}
