'use server';
import { generateTokenForPhoneNumber } from '@/app/lib/data/token';
import { signJwt } from '@/app/lib/jwt/token';
import prisma from '@/app/lib/prisma';
import { TPhoneNumberSchema, phoneNumberSchema } from '@/app/types/account';
import { getUserByJwtToken } from './getUsetByJwtToken';

export const sendTokenToPhoneNumber = async ({
  byPhoneNumber,
  byCookie,
}: {
  byPhoneNumber?: TPhoneNumberSchema;
  byCookie?: boolean;
}) => {
  // Todo : rate limit

  // Specify phone number with id or phone number
  let phoneNumber;
  if (byPhoneNumber) {
    // zod validation
    const validationFields = phoneNumberSchema.safeParse(byPhoneNumber);
    if (!validationFields.success) return { error: 'Invalid Fields!' };
    phoneNumber = byPhoneNumber?.phoneNumber;
  }

  if (byCookie) {
    const user = await getUserByJwtToken();
    if (!user) return { error: 'User not found!' };
    phoneNumber = user.phoneNumber;
  }

  if (!phoneNumber) return { error: 'Phone number is required!' };

  // Generate token
  const { token, expiresAt } = generateTokenForPhoneNumber();
  const signedToken = signJwt({ token });

  //save phone number and signed secret key
  await prisma.phoneNumberToken.upsert({
    where: { phoneNumber },
    create: {
      phoneNumber,
      token: signedToken,
      expiresAt,
    },
    update: {
      token: signedToken,
      expiresAt,
    },
  });

  // TODO: send otp to user phone
  console.log('Token :', token);

  if (byCookie) {
    return {
      phoneNumber,
      success: 'Enter verification code sent to your phone.',
    };
  }
  return { success: 'Enter verification code sent to your phone' };
};
