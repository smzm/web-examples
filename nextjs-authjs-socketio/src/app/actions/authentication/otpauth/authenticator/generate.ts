'use server';
import { getUserById } from '@/app/lib/data/user';
import { signJwt } from '@/app/lib/jwt/token';
import { prisma } from '@/app/lib/prisma';
import { randomBytes } from 'crypto';
import { encode } from 'hi-base32';
import * as OTPAuth from 'otpauth';

const generateRandomBase32 = () => {
  const buffer = randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, '').substring(0, 24);
  return base32;
};

export default async function generate2faSecret(id: string) {
  const user = await getUserById({ id });
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  // generate otp
  const secret = generateRandomBase32();
  const signedSecret = signJwt({ secret });

  let totp = new OTPAuth.TOTP({
    issuer: process.env.APP_DOMAIN,
    label: process.env.APP_LABEL,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  });

  let otpByAuthenticatorUrl = totp.toString();

  try {
    const otp = await prisma.user.update({
      where: {
        id,
      },
      data: {
        otpByAuthenticatorSecret: signedSecret,
        otpByAuthenticatorUrl,
      },
    });
    return { success: true, otpByAuthenticatorUrl };
  } catch (e) {
    return { success: false, error: 'Error creating secret' };
  }
}
