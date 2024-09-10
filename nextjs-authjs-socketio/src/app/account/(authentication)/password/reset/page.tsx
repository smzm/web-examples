'use client';
import { submitNewPasswordByToken } from '@/app/actions/authentication/password/submitNewPassword';
import Button from '@/app/components/AtomicUI/Button';
import { PasswordField } from '@/app/components/AtomicUI/InputField';
import { TPasswordSchema, passwordSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function PasswordReset() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [err, setErr] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<TPasswordSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(passwordSchema),
  });

  function handlePasswordReset(data: TPasswordSchema) {
    startTransition(() => {
      if (!token) {
        return;
      }
      submitNewPasswordByToken(data, token).then((res) => {
        if (res.error) {
          setErr(res.error);
        } else if (res.success) {
          setSuccess(res.success);
          reset();
        }
      });
    });
  }

  if (!token) {
    redirect('/account/login');
  }
  return (
    <div>
      <form onSubmit={handleSubmit(handlePasswordReset)}>
        <div className="my-8">
          <PasswordField
            label="Password"
            register={register}
            control={control}
            errors={errors}
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            register={register}
            control={control}
            errors={errors}
            passwordStrengthMeter={false}
          />
        </div>
        <Button size="large" disabled={isSubmitting} variant="primary">
          Set new password
        </Button>
      </form>
      {!success && err ? (
        <p className="my-4 w-full rounded-lg bg-red-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          {err}
        </p>
      ) : null}
      {success ? (
        <div className="my-4 w-full rounded-lg bg-green-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          <p>{success}</p>
          <Link className="cursor-pointer underline" href="/account/login">
            Login
          </Link>
        </div>
      ) : null}
    </div>
  );
}
