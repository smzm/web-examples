'use client';
import { sendEmailVerificationToken } from '@/app/actions/authentication/email/sendEmailVerificationToken';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { identifierSchema, TIdentifierSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function IdentifierForm() {
  // ? rate limit
  const [credentialsError, setCredentialsError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // RHF + Zod Type
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TIdentifierSchema>({
    resolver: zodResolver(identifierSchema),
  });

  function handleSignIn(data: TIdentifierSchema) {
    setCredentialsError(null);
    setSuccess(null);

    startTransition(() => {
      sendEmailVerificationToken({
        id: null,
        name: null,
        identifier: data.identifier,
        type: 'forgetPassword',
        redirectPath: '/account/password/reset',
      }).then((res) => {
        if (res.error) {
          setCredentialsError(res.error);
        } else if (res.success) {
          setSuccess(res.success);
        }
      });
    });
  }
  return (
    <div className="mx-auto my-10 w-full">
      <h1 className="p-4 text-2xl font-semibold"> Forgot your password </h1>
      <p className="my-4 w-full rounded-lg px-2 py-1 text-sm font-normal leading-loose tracking-wider text-gray-800 transition-all duration-200">
        Enter your email or username and we&apos;ll send you a link to your
        email address to get back into your account.{' '}
      </p>
      <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col">
        <InputField
          name="identifier"
          label="Email or Username"
          register={register}
          errors={errors}
        />
        {errors.identifier && (
          <div className="absolute right-2 rounded-lg bg-red-400 px-4 py-1 text-sm font-light text-gray-50">
            {errors.identifier.message}
          </div>
        )}

        <Button size="large" variant="primary">
          Submit
        </Button>
      </form>
      {credentialsError && (
        <div className="w-full rounded-lg bg-red-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          {credentialsError}
        </div>
      )}
      {success && (
        <div className="w-full rounded-lg bg-green-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          {success}
        </div>
      )}
    </div>
  );
}
