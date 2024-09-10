'use server';
import { getUserById } from '@/app/lib/data/user';
import { verifyJwt } from '@/app/lib/jwt/token';
import prisma from '@/app/lib/prisma';
import * as OTPAuth from 'otpauth';

export default async function verify2faSecret(id: string, token: string) {
  // lookup the database to find user
  const user = await getUserById({ id });

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!user.otpByAuthenticatorSecret) {
    return {
      success: false,
      error: 'First, enable 2 factor authentication from security',
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
    return { succes: false, error: 'Invalid token' };
  }

  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      otpByAuthenticator: true,
      otpByAuthenticatorVerified: true,
    },
  });

  return {
    success: true,
    otpByAuthenticator: updateUser.otpByAuthenticator,
    otpByAuthenticatorVerified: updateUser.otpByAuthenticatorVerified,
  };
}
