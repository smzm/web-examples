'use client';
import { sendEmailVerificationToken } from '@/app/actions/authentication/email/sendEmailVerificationToken';
import isIdentifierBelongtoUser from '@/app/actions/authentication/password/isIdentifierBelongtoUser';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { identifierSchema, TIdentifierSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import VerificationByPhoneNumber from '../../components/verification/form-phone';

type CredentialsError =
  | {
      identifier: { message: string };
    }
  | ''; // because of functionality of input-field if there is no error it should be empty string

export default function PasswordRestVerificationByEmail() {
  // ? rate limiter
  const [credentialsError, setCredentialsError] =
    useState<CredentialsError>('');
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // RHF + Zod Type
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TIdentifierSchema>({
    resolver: zodResolver(identifierSchema),
  });

  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  const { id, name, email, username } = session?.user;
  if (!username) {
    router.replace('/account/login');
  }

  function handleSignIn(data: TIdentifierSchema) {
    setCredentialsError('');
    setSuccess(null);
    startTransition(() => {
      // Check to see identifier provided is not registered before
      if (!email || !username) redirect('/account/login');
      isIdentifierBelongtoUser(email, username, data).then((res) => {
        if (res.error) {
          setCredentialsError({ identifier: { message: res.error } });
          return;
        } else {
          sendEmailVerificationToken({
            id,
            name,
            identifier: data.identifier,
            type: 'forgetPassword',
            redirectPath: '/account/security/password/reset',
          }).then((res) => {
            if (res.error) {
              setCredentialsError({ identifier: { message: res.error } });
            } else if (res.success) {
              setSuccess(res.success);
            }
          });
        }
      });
    });
  }
  return (
    <div className="mx-auto my-10">
      <div>
        <p className="my-4 w-full rounded-lg px-2 py-1 text-sm font-normal leading-loose tracking-wider text-gray-800 transition-all duration-200">
          Enter your email or username and we&apos;ll send you a link to your
          email address to get back into your account.{' '}
        </p>
        <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col">
          <InputField
            name="identifier"
            label="Email or Username"
            register={register}
            errors={credentialsError ? credentialsError : errors}
          />

          <Button size="lg" variant="default" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      </div>

      {success && (
        <div className="w-full rounded-lg bg-green-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          {success}

          <button
            className="cursor-pointer underline"
            onClick={() => window.location.replace('/account/profile')}
          >
            Back to Profile
          </button>
        </div>
      )}
    </div>
  );
}
