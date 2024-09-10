'use server';

import { generateTokenForPhoneNumber } from '@/app/lib/data/token';
import { getUserByPhoneNumber } from '@/app/lib/data/user';
import { signJwt } from '@/app/lib/jwt/token';
import prisma from '@/app/lib/prisma';
import { TPhoneNumberSchema, phoneNumberSchema } from '@/app/types/account';

export default async function submitPhoneNumber(
  PhoneNumber: TPhoneNumberSchema,
) {
  // zod validation
  const validationFields = phoneNumberSchema.safeParse(PhoneNumber);
  if (!validationFields.success) return { error: 'Invalid Fields!' };

  const { phoneNumber } = validationFields.data;

  // check phone number not exist in db
  const exisitingUser = await getUserByPhoneNumber(PhoneNumber);
  if (exisitingUser) return { error: 'Phone number already exists!' };

  // Generate token
  const { token, expiresAt } = generateTokenForPhoneNumber();
  const signedToken = signJwt({ token });

  //save phone number and signed secret key
  await prisma.phoneNumberToken.upsert({
    where: {
      phoneNumber,
    },
    update: {
      token: signedToken,
      expiresAt,
    },
    create: {
      phoneNumber,
      token: signedToken,
      expiresAt,
    },
  });

  // TODO: send otp to user phone
  console.log('Token :', token);
  return {
    success: 'Enter verification code sent to your phone.',
  };
}
