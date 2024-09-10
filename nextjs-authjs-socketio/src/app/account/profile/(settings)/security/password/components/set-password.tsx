'use client';
import { submitNewPassword } from '@/app/actions/authentication/password/submitNewPassword';
import Button from '@/app/components/AtomicUI/Button';
import { PasswordField } from '@/app/components/AtomicUI/InputField';
import { TPasswordSchema, passwordSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SetPassword({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const { update } = useSession();
  const next = searchParams.get('next');
  const [err, setErr] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const router = useRouter();

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

  function handlePasswordReset(Password: TPasswordSchema) {
    startTransition(() => {
      submitNewPassword({ id, Password }).then((res) => {
        if (res.error) {
          setErr(res.error);
        } else if (res.success) {
          update();
          setSuccess(res.success);
          reset();
          if (next) {
            router.replace(next);
          }
        }
      });
    });
  }

  return (
    <div className="mx-auto w-1/2">
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
        <Button size="lg" disabled={isSubmitting} variant="default">
          Set new password
        </Button>
      </form>
      {!success && err ? (
        <p className="my-4 w-full rounded-lg bg-red-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          {err}
        </p>
      ) : null}
      {/* {success ? (
        <div className="my-4 w-full rounded-lg bg-green-500 px-2 py-1 text-center text-sm font-light leading-loose tracking-wider text-white transition-all duration-200">
          <p>{success}</p>

          <button
            className="cursor-pointer underline"
            onClick={() => window.location.replace('/account/profile')}
          >
            Back to Profile
          </button>
        </div>
      ) : null} */}
    </div>
  );
}
