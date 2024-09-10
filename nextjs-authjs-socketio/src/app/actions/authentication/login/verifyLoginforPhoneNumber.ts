'use server';
import verify2faByPhoneNumber from '@/app/actions/authentication/otpauth/phone/verify';
import { signIn } from '@/app/lib/authentication/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/app/lib/authentication/routes';
import { getUserSignedInfo } from '@/app/lib/data/user';
import { TPhoneNumberSchema, TTwoFactorSchema } from '@/app/types/account';
import { getUserByJwtToken } from './getUsetByJwtToken';

export default async function verifyLoginForPhoneNumber({
  PhoneNumber,
  Token,
}: {
  PhoneNumber: TPhoneNumberSchema;
  Token: TTwoFactorSchema;
}) {
  // Get id from cookie
  const user = await getUserByJwtToken();
  if (!user) return { error: 'User not exist' };

  // Verify token
  const verifyToken = await verify2faByPhoneNumber({
    PhoneNumber,
    Token,
  });

  // If token is not valid
  if (verifyToken.error) {
    return { error: verifyToken.error, details: verifyToken.details };
  }

  // If token is valid
  if (verifyToken.success) {
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
