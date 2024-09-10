'use client';

import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { TUsernameSchema, usernameSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

type UsernameError =
  | {
      username: { message: string };
    }
  | ''; // because of functionality of input-field if there is no error it should be empty string

type Result = {
  success: string | undefined;
  error: string | undefined;
};

export default function ChangeUsername() {
  const [result, setResult] = useState<Result>({ success: '', error: '' });
  const [usernameError, setUsernameError] = useState<UsernameError>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUsernameSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      // username,
    },
  });

  // //* Submit new username
  async function handleUsername(data: TUsernameSchema) {
    const { username } = data;
    setResult({ success: '', error: '' });
    startTransition(() => {});
  }

  return (
    <div className="">
      <h1 className="my-10 text-lg tracking-wide text-gray-700">
        Change Username
      </h1>
      <form className="flex flex-col" onSubmit={handleSubmit(handleUsername)}>
        <div className="relative mb-4 flex flex-col">
          <InputField
            label="Username"
            name="username"
            register={register}
            errors={errors.username ? errors : usernameError}
            onChangeCallback={() => setUsernameError('')}
          />
        </div>

        <Button
          size="large"
          disabled={isSubmitting}
          type="submit"
          color="night"
        >
          Sign up
        </Button>

        {result.success && (
          <div className="rounded-lg bg-green-400 p-2 text-center text-white">
            {result.success}
          </div>
        )}

        {result.error && (
          <div className="rounded-lg bg-green-400 p-2 text-center text-white">
            {result.error}
          </div>
        )}
      </form>
    </div>
  );
}
