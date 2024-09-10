'use server';

import { signIn } from '@/app/lib/authentication/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/app/lib/authentication/routes';
import { TPhoneNumberSchema, TTwoFactorSchema } from '@/app/types/account';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export const loginByPhoneNumber = async ({
  PhoneNumber,
  Token,
}: {
  PhoneNumber: TPhoneNumberSchema;
  Token: TTwoFactorSchema;
}) => {
  // check if the credentials are valid
  const { token } = Token;
  const { phoneNumber } = PhoneNumber;

  // if the credentials are valid, try to sign in
  try {
    await signIn('credentials', {
      phoneNumber,
      token,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: `Somthing wrong happend` };
        case 'CallbackRouteError':
          if (error.cause && error.cause.details === 'invalid-token') {
            return { error: 'code is wrong', code: 403 };
          } else if (
            error.cause &&
            error.cause.details === 'two-factor-authentication'
          ) {
            redirect('/account/login/2fa');
          } else if (
            error.cause &&
            error.cause.details === 'username-or-name-is-null'
          ) {
            redirect('/account/signup/completion');
          } else if (
            error.cause &&
            error.cause.details === 'something-went-wrong'
          ) {
            return {
              error: 'Something went wrong',
              details: 'something-went-wrong',
            };
          }
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
};
