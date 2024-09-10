'use client';

import verifyLoginByTFA from '@/app/actions/authentication/login/verifyLoginForOtp';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { TTwoFactorSchema, twoFactorSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function TFAByAuthenticator() {
  const [tokenError, setTokenError] = useState<any>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TTwoFactorSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(twoFactorSchema),
  });

  function handleTwoFactorAuthentication(Token: TTwoFactorSchema) {
    startTransition(() => {
      verifyLoginByTFA({ Token }).then((res) => {
        if (res?.error) {
          setTokenError({ token: { message: res.error } });
        }
      });
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleTwoFactorAuthentication)}>
        <InputField
          register={register}
          label="Enter two factor authentication code"
          name="token"
          errors={errors.token?.message ? errors : tokenError}
          onChangeCallback={() => setTokenError('')}
        />
        <Button type="submit" variant="primary" size="large">
          Submit
        </Button>
      </form>
    </div>
  );
}
