'use client';

import CompleteSignup from '@/app/actions/authentication/signup/completeSignup';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import {
  TSignupCompletionSchema,
  signupCompletionSchema,
} from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
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

export default function SetUsernameForm({
  id,
  name,
}: {
  id: string;
  name?: string;
}) {
  const [result, setResult] = useState<Result>({ success: '', error: '' });
  const [usernameError, setUsernameError] = useState<UsernameError>('');
  const [isWaiting, setIsWaiting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignupCompletionSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(signupCompletionSchema),
    defaultValues: {
      name: name || '',
    },
  });

  // //* Submit Profile Process
  async function handleProfile(data: TSignupCompletionSchema) {
    const { username, name } = data;
    setResult({ success: '', error: '' });
    setIsWaiting(true);
    startTransition(() => {
      CompleteSignup({
        Name: { name },
        Username: { username },
        id: id,
      }).then((res) => {
        if (res?.error) {
          if (res.target as string[]) {
            setUsernameError({ username: { message: res.error } });
            setIsWaiting(false);
            return;
          }
          setResult({ success: '', error: res.error });
          setIsWaiting(false);
          return;
        }
      });
      setIsWaiting(false);
    });
  }

  return (
    <div className="mx-auto w-full">
      <div className="mb-12">
        <h1 className='text-night-250" text-center text-[2.2rem] font-bold tracking-normal'>
          Complete Your Sign up
        </h1>
        <div className="mt-6 flex h-px flex-1 items-center gap-4 bg-night-750 text-sm text-night-600"></div>
      </div>
      <form
        className={`flex flex-col ${Boolean(result.success) && 'opacity-50'}`}
        onSubmit={handleSubmit(handleProfile)}
      >
        <div className="relative mb-4 flex w-full justify-between space-x-4">
          <InputField
            label="Name"
            name="name"
            register={register}
            errors={errors}
            disabled={Boolean(result.success)}
          />
        </div>
        <div className="relative mb-4 flex flex-col">
          <InputField
            label="Username"
            name="username"
            register={register}
            errors={errors.username ? errors : usernameError}
            onChangeCallback={() => setUsernameError('')}
            disabled={Boolean(result.success)}
          />
        </div>

        <Button
          size="large"
          variant="primary"
          color="night"
          type="submit"
          disabled={Boolean(result.success)}
          waiting={isWaiting}
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
