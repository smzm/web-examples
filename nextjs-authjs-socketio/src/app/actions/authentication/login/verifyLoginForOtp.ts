'use server';
import validate2faSecret from '@/app/actions/authentication/otpauth/authenticator/validate';
import { signIn } from '@/app/lib/authentication/auth';
import { getUserSignedInfo } from '@/app/lib/data/user';
import { TTwoFactorSchema, twoFactorSchema } from '@/app/types/account';
import { DEFAULT_LOGIN_REDIRECT } from '../../../lib/authentication/routes';
import { getUserByJwtToken } from './getUsetByJwtToken';

export default async function verifyLoginByTFA({
  Token,
}: {
  Token: TTwoFactorSchema;
}) {
  // zod validation
  const tokenValidation = twoFactorSchema.safeParse(Token);
  if (!tokenValidation.success) {
    return { success: false, error: 'wrong code' };
  }

  // Get id from cookie
  const user = await getUserByJwtToken();
  if (!user) return { error: 'User not exist' };

  // Check if user has enabled otp
  if (!user.otpByAuthenticator) {
    return {
      error: 'otp not enabled',
    };
  }

  // Verify token
  const isValidate = await validate2faSecret({ id: user.id, Token });

  // If token is not valid
  if (isValidate.error) {
    return {
      error: isValidate.error,
    };
  }

  // If token is valid
  if (isValidate.success) {
    const jwt = await getUserSignedInfo(user.id);
    if (!jwt) return { error: 'No user found' };

    try {
      await signIn('credentials', {
        jwt,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });
    } catch (Error) {
      throw Error;
    }
  }
}
