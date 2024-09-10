'use server';
import { generateTokenForPhoneNumber } from '@/app/lib/data/token';
import { getUserById, getUserByPhoneNumber } from '@/app/lib/data/user';
import { signJwt } from '@/app/lib/jwt/token';
import { prisma } from '@/app/lib/prisma';
import { TPhoneNumberSchema, phoneNumberSchema } from '@/app/types/account';

export async function generate2faByPhone({
  id,
  PhoneNumber,
}: {
  id: string;
  PhoneNumber: TPhoneNumberSchema;
}) {
  // zod validation
  const validPhoneNumber = phoneNumberSchema.safeParse(PhoneNumber);
  if (!validPhoneNumber.success) {
    return { error: validPhoneNumber.error.issues[0].message };
  }
  const phoneNumber = PhoneNumber.phoneNumber;

  //  Check phone Number not used by other users
  const existUser = await getUserByPhoneNumber(PhoneNumber);
  const user = await getUserById({ id });
  // if any user has this phone number and that user is not the current user
  if (existUser && user?.phoneNumber !== phoneNumber) {
    return { error: 'There is an account with this phone number' };
  }

  // Generate token
  const { token, expiresAt } = generateTokenForPhoneNumber();
  const signedToken = signJwt({ token });

  //save phone number and signed secret key
  const [phoneNumberTokenGenerated, userPhoneNumberUpdated] =
    await prisma.$transaction([
      prisma.phoneNumberToken.upsert({
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
      }),
      prisma.user.update({
        where: {
          id,
        },
        data: {
          phoneNumber,
        },
      }),
    ]);

  if (!userPhoneNumberUpdated || !phoneNumberTokenGenerated) {
    return { error: 'Something went wrong, try agin later!' };
  }

  // TODO: send otp to user phone
  console.log('Token :', token);

  return { success: true };
}
