'use server';
import { signIn } from '@/app/lib/authentication/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/app/lib/authentication/routes';
import {
  TSignInByCredentialsSchema,
  signInByCredentialsSchema,
} from '@/app/types/account';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export const loginByCredentials = async (
  Credentials: TSignInByCredentialsSchema,
) => {
  // check if the credentials are valid
  const validateFields = signInByCredentialsSchema.safeParse(Credentials);
  if (!validateFields.success)
    return { error: 'Not valid', details: 'not-valid' };

  const { identifier, password } = Credentials;

  // if the credentials are valid, try to sign in
  try {
    await signIn('credentials', {
      identifier,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          const isEmail = Credentials.identifier.includes('@');
          const identifierType = isEmail ? 'Email' : 'Username';
          return { error: `${identifierType} or password is wrong` };
        case 'CallbackRouteError':
          if (error.cause && error.cause.details === 'email-not-verified') {
            return {
              error: 'Email not verified',
              code: 403,
              details: 'email-not-verified',
            };
          } else if (error.cause && error.cause.details === 'no-password') {
            return {
              error: 'Your account is not accessible with this credentials',
              details: 'use-oauth',
            };
          } else if (
            error.cause &&
            error.cause.details === 'username-or-name-is-null'
          ) {
            redirect('/account/signup/completion');
          } else if (
            error.cause &&
            error.cause.details === 'two-factor-authentication'
          ) {
            redirect('/account/login/2fa');
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
