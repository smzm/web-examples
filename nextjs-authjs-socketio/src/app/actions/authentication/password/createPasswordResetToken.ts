'use server';
import { getUserByPhoneNumber } from '@/app/lib/data/user';
import { signJwt } from '@/app/lib/jwt/token';
import prisma from '@/app/lib/prisma';
import { rateLimiter } from '@/app/lib/redis/rateLimiter/queries';
import {
  TPhoneNumberSchema,
  TTwoFactorSchema,
  phoneNumberSchema,
  twoFactorSchema,
} from '@/app/types/account';
import { randomUUID } from 'crypto';
import { redirect } from 'next/navigation';
import verify2faByPhoneNumber from '../otpauth/phone/verify';

export async function PasswordResetTokenByPhoneNumber({
  PhoneNumber,
  PhoneNumberToken,
}: {
  PhoneNumber: TPhoneNumberSchema;
  PhoneNumberToken: TTwoFactorSchema;
}) {
  // ? Add rate limiter which is based on user identifier
  // rate limit based on ip address
  const rateLimit = await rateLimiter({
    endpoint: 'sendEmailVerificationToken',
    rate_limit: {
      time: 60 * 5, // 5 min
      limit: 10,
    },
  });
  if (!rateLimit.success) return { error: rateLimit.error };

  // zod validation
  const tokenValidation = twoFactorSchema.safeParse(PhoneNumberToken);
  const phoneNumberValidation = phoneNumberSchema.safeParse(PhoneNumber);
  if (!tokenValidation.success) return { error: 'wrong code' };
  if (!phoneNumberValidation.success) return { error: 'wrong phone number' };
  const { phoneNumber } = phoneNumberValidation.data;

  // validate token
  const isTokenValidate = await verify2faByPhoneNumber({
    PhoneNumber,
    Token: PhoneNumberToken,
  });
  if (!isTokenValidate.success) return { error: 'wrong code' };

  // if token is valid get user information
  const user = await getUserByPhoneNumber({ phoneNumber });
  if (!user) return { error: 'User not found' };
  const { id } = user;

  // generate verification token
  const passwordResetToken = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
  const signedToken = signJwt({ token: passwordResetToken });

  // upsert token in db
  try {
    await prisma.passwordResetToken.upsert({
      where: { userId: id },
      update: {
        token: passwordResetToken,
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours
      },
      create: {
        token: passwordResetToken,
        expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours
        userId: id,
      },
    });
  } catch (err) {
    throw new Error('Could not create password reset token');
  }

  redirect(`/account/security/password/reset?token=${signedToken}`);
}
