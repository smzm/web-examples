'use client';

import CheckEmailValidity from '@/app/actions/authentication/email/CheckEmailValidity';
import registerByCredential from '@/app/actions/authentication/signup/registerByCredentials';

import Button from '@/app/components/AtomicUI/Button';
import {
  InputField,
  PasswordField,
} from '@/app/components/AtomicUI/InputField';
import { TSignupByEmailSchema, signupByEmailSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { startTransition, useOptimistic, useState } from 'react';
import { useForm } from 'react-hook-form';

type RegsiterError =
  | {
      // example --> { username : { message: "username already exists" }}
      [key: string]: { message: string };
    }
  | ''; // because of functionality of input-field if there is no error it should be empty string

type Result = {
  success: string | undefined;
  error: string | undefined;
};

export default function SignupByEmail() {
  const [registerError, setRegisterError] = useState<RegsiterError>('');
  const [result, setResult] = useState<Result>({ success: '', error: '' });

  // Optimistically update message
  const [optimisticMessage, addOptimisticMessage] = useOptimistic(
    result,
    (result: Result, optimisticResult: Result) => {
      return optimisticResult;
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TSignupByEmailSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(signupByEmailSchema),
  });

  const [isWaiting, setIsWaiting] = useState(false);

  //* Sign up Process
  async function handleSignup(data: TSignupByEmailSchema) {
    setRegisterError('');
    setResult({ success: '', error: '' });
    setIsWaiting(true);

    startTransition(() => {
      // Check email validity
      CheckEmailValidity(data).then((res) => {
        if (!res.isValid) {
          setRegisterError({ email: { message: res.error } });
          setIsWaiting(false);
          return;
        } else {
          // update optimistically message if email is valid
          addOptimisticMessage({
            success: 'Email will be send in couple of second...',
            error: '',
          });
        }
      });

      // register user
      registerByCredential(data).then((res) => {
        if (res?.error) {
          if (res.target as string[]) {
            const e: { [key: string]: { message: string } } = {};
            (res.target as string[]).forEach((t) => {
              e[t] = {
                message: res.error,
              };
            });
            setRegisterError(e);
            setIsWaiting(false);
            return;
          }
          setResult({
            success: '',
            error: res.error,
          });
          setIsWaiting(false);
          return;
        } else {
          setResult({ success: res.success, error: '' });
          setIsWaiting(false);
        }
      });
    });
  }

  return (
    <div className="flex flex-col space-y-6">
      <form
        className={`flex flex-col ${Boolean(result.success) && 'opacity-50'}`}
        onSubmit={handleSubmit(handleSignup)}
      >
        <div className="relative flex flex-col">
          <InputField
            label="Email"
            name="email"
            register={register}
            errors={registerError || errors}
            // onChangeCallback={()=>}
            disabled={Boolean(result.success)}
          />
        </div>

        <div className="mb-4 flex w-full flex-col space-y-1">
          <PasswordField
            label="Password"
            register={register}
            control={control}
            errors={errors}
            disabled={Boolean(result.success)}
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            register={register}
            control={control}
            errors={errors}
            passwordStrengthMeter={false}
            disabled={Boolean(result.success)}
          />
        </div>

        <Button
          size="large"
          variant="primary"
          color="night"
          waiting={isWaiting}
          type={Boolean(result.success) ? 'button' : 'submit'}
        >
          Sign up
        </Button>
      </form>
      {optimisticMessage.success && (
        <div className="mt-4 rounded-lg bg-green-600 p-2 text-center text-sm font-semibold text-white">
          {optimisticMessage.success}
        </div>
      )}

      {optimisticMessage.error && (
        <div className="mt-4 rounded-lg bg-red-400 p-2 text-center text-white">
          {optimisticMessage.error}
        </div>
      )}
    </div>
  );
}
