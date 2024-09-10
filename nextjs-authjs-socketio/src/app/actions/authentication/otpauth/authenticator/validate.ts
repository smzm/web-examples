'use server';
import { getUserById } from '@/app/lib/data/user';
import { verifyJwt } from '@/app/lib/jwt/token';
import prisma from '@/app/lib/prisma';
import { TTwoFactorSchema, twoFactorSchema } from '@/app/types/account';
import * as OTPAuth from 'otpauth';

export default async function validate2faSecret({
  id,
  Token,
}: {
  id: string;
  Token: TTwoFactorSchema;
}) {
  // validate token
  const tokenValidation = twoFactorSchema.safeParse(Token);
  if (!tokenValidation.success) {
    return { success: false, error: 'wrong code' };
  }
  const token = tokenValidation.data.token;

  // lookup the database to find user
  const user = await getUserById({ id });

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!user.otpByAuthenticatorSecret || !user.otpByAuthenticator) {
    return {
      success: false,
      error:
        'First, enable 2 factor authentication from security section of your profile',
    };
  }

  const payload = verifyJwt(user.otpByAuthenticatorSecret);
  const secret = payload?.secret;

  let totp = new OTPAuth.TOTP({
    issuer: process.env.NEXTAUTH_URL,
    label: process.env.APP_LABEL,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });

  let isValid = totp.validate({
    token,
    window: 1,
  });
  if (isValid === null) {
    return { succes: false, error: 'Wrong code' };
  }

  // update user
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      otpByAuthenticatorVerified: true,
    },
  });

  return { success: true };
}
