'use client';
import { loginIdentifierValidation } from '@/app/actions/authentication/login/loginIdentifierValidation';
import { sendTokenToPhoneNumber } from '@/app/actions/authentication/login/sendTokenToPhoneNumber';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { TIdentifierSchema, identifierSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IdentifierTypes } from '../page';

export function IdentiferForm({
  identifierType,
  setIdentifierType,
  identifierValidationError,
  setIdentifierValidationError,
  setIdentifier,
  setSentTokenToPhoneNumber,
}: any) {
  const searchParams = useSearchParams();
  const identifierParam = searchParams?.get('identifier');

  // RHF + Zod Type
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TIdentifierSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(identifierSchema),
    defaultValues: {
      identifier: identifierParam ? identifierParam : '',
    },
  });

  // Handle Submit
  function handleSignIn(data: TIdentifierSchema) {
    setIdentifierValidationError({ error: '' });

    loginIdentifierValidation(data).then((res) => {
      if (!res) return null;
      setIdentifierType(res.identifierType);
      // If error exists
      if (res.identifierValidationError) {
        setIdentifierValidationError({
          error: {
            identifier: { message: res.identifierValidationError },
          },
        });
        return null;
        // If error doesn't exist
      } else {
        setIdentifierValidationError({});
        const { identifier } = data;
        setIdentifier(identifier);

        // If identifier is phone number send token
        if (res.identifierType === IdentifierTypes.PhoneNumber) {
          sendTokenToPhoneNumber({
            byPhoneNumber: { phoneNumber: identifier },
          }).then((res) => {
            if (res.error) {
              setIdentifierValidationError({
                error: {
                  identifier: { message: res.error },
                },
              });
            } else if (res.success) {
              setSentTokenToPhoneNumber(true);
            }
          });
        }
      }
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col">
        <InputField
          label={
            !identifierType
              ? 'Email or Username or Phone Number'
              : identifierType[0].toUpperCase() + identifierType.slice(1)
          }
          name="identifier"
          register={register}
          errors={
            errors.hasOwnProperty('identifier')
              ? errors
              : identifierValidationError.hasOwnProperty('error')
                ? identifierValidationError.error
                : {
                    identifier: { message: '' },
                  }
          }
          onChangeCallback={() => setIdentifierValidationError({ error: '' })}
        />
        {!identifierType ||
        identifierValidationError.hasOwnProperty('error') ? (
          <Button size="large" variant="primary" color="night" className="mt-4">
            Sign In
          </Button>
        ) : null}
      </form>
      {!identifierType || identifierValidationError.hasOwnProperty('error') ? (
        <p className="mt-6 px-2 text-base font-medium text-night-400">
          Don't have an account?{' '}
          <Link
            href="/account/signup"
            className="cursor-pointer text-base font-normal text-night-300 underline transition hover:text-night-200"
          >
            Sign up
          </Link>
        </p>
      ) : null}
    </div>
  );
}
