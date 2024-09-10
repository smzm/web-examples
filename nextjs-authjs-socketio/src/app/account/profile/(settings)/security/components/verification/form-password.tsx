'use client';
import passwordVerification from '@/app/actions/authentication/password/passwordVerification';
import Button from '@/app/components/AtomicUI/Button';
import { PasswordField } from '@/app/components/AtomicUI/InputField';
import { TPasswordSchema, passwordSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useVerification } from './verification-contex';

type CredentialError =
  | {
      password: { message: string };
    }
  | ''; // because of functionality of input-field if there is no error it should be empty string

export default function VerificationByPassword() {
  const { setIsVerified, path } = useVerification();
  const [credentialError, setCredentialError] = useState<CredentialError>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<TPasswordSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(passwordSchema),
  });
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  const { hasPassword } = session?.user;

  async function handleVerification(password: TPasswordSchema) {
    setCredentialError('');
    startTransition(() => {
      passwordVerification(password).then((res) => {
        if (res?.error) {
          setCredentialError({ password: { message: res.error } });
        }
        if (res?.success) {
          setIsVerified(true);
        }
      });
    });
  }

  return (
    <div className="flex flex-col justify-center">
      {hasPassword ? (
        <form onSubmit={handleSubmit(handleVerification)}>
          <PasswordField
            label="Password"
            register={register}
            control={control}
            errors={credentialError ? credentialError : errors}
            passwordStrengthMeter={false}
          />
          <Link
            className="mb-8 cursor-pointer text-sm font-light tracking-wider text-gray-400 hover:underline"
            href="/account/security/password/forgot"
          >
            Forgot your password ?
          </Link>
          <Button
            size="large"
            disabled={isSubmitting}
            type="submit"
            className="btn-lg bg-gray-900 text-gray-100 hover:bg-gray-800"
          >
            Submit
          </Button>
        </form>
      ) : (
        <div>
          <p className="my-8 text-lg font-medium text-gray-700">
            You need to set a password to commit any changes in your account.
          </p>
          <Link
            href={`/account/security/password?next=${path}`}
            className="text-gray-400 hover:underline"
          >
            <Button size="large" variant="primary">
              Create a password
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
