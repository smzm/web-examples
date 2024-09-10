'use client';
import validate2faSecret from '@/app/actions/authentication/otpauth/authenticator/validate';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { TTwoFactorSchema, twoFactorSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useVerification } from './verification-contex';

export default function VerificationByOtp() {
  const { setIsVerified } = useVerification();
  const [tokenError, setTokenError] = useState<any>('');
  const { data: session } = useSession();
  const id = session?.user.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TTwoFactorSchema>({
    resolver: zodResolver(twoFactorSchema),
  });

  function handleVerificationByOtp(Token: TTwoFactorSchema) {
    if (!id) {
      return null;
    }
    startTransition(() => {
      validate2faSecret({ Token, id }).then((res) => {
        if (res?.error) {
          return setTokenError({ token: { message: res.error } });
        }
        if (res?.success) {
          setIsVerified(true);
        }
      });
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleVerificationByOtp)} className="mt-8">
        <InputField
          label="Verification code"
          name="token"
          register={register}
          errors={errors.token?.message ? errors : tokenError}
          onChangeCallback={() => setTokenError('')}
        />
        <Button type="submit" size="large" variant="primary">
          Verify
        </Button>
      </form>
    </div>
  );
}
