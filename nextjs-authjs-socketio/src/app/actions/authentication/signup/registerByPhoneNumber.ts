'use server';
import { signIn } from '@/app/lib/authentication/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/app/lib/authentication/routes';
import prisma from '@/app/lib/prisma';
import {
  TPhoneNumberSchema,
  TTwoFactorSchema,
  phoneNumberSchema,
  twoFactorSchema,
} from '@/app/types/account';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import verify2faByPhoneNumber from '../otpauth/phone/verify';

export default async function registerByPhoneNumber(
  PhoneNumber: TPhoneNumberSchema,
  Token: TTwoFactorSchema,
) {
  // Validate fields with zod
  const phoneNumbebrValidation = phoneNumberSchema.safeParse(PhoneNumber);
  const tokenValidation = twoFactorSchema.safeParse(Token);
  if (!phoneNumbebrValidation.success || !tokenValidation.success)
    return { error: 'Invalid Fields!' };

  const { phoneNumber } = phoneNumbebrValidation.data;
  const { token: token } = tokenValidation.data;

  // verify token
  const isVerify = await verify2faByPhoneNumber({
    PhoneNumber,
    Token,
    deleteToken: false,
  });
  if (!isVerify.success) return { error: 'wrong token' };

  // create user account
  try {
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        phoneVerified: new Date(Date.now()),
        otpByPhone: true,
        otpByPhoneVerified: new Date(Date.now()),
      },
    });
  } catch (e) {
    console.log('Error: ', e);
    return {
      error: 'Something went wrong!',
      details: 'failed-to-create-user',
    };
  }

  // if user created successfully, sign in user
  try {
    await signIn('credentials', {
      phoneNumber,
      token,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log(error);
      if (error.cause && error.cause.details === 'username-or-name-is-null') {
        redirect('/account/signup/completion');
      }
    }
    throw error;
  }
}
