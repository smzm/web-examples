'use server';
import {
  deleteTokenForPhoneNumber,
  verifyTokenForPhoneNumber,
} from '@/app/lib/data/token';
import { getUserByPhoneNumber } from '@/app/lib/data/user';
import prisma from '@/app/lib/prisma';

export default async function enable2faByPhone({
  id,
  token,
  phoneNumber,
}: {
  id: string;
  token: string;
  phoneNumber: string;
}) {
  const user = await getUserByPhoneNumber({ phoneNumber });
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  // verify token
  const verificationResult = await verifyTokenForPhoneNumber(
    token,
    phoneNumber,
  );
  if (!verificationResult) {
    return { error: 'code is wrong', details: 'wrong-code' };
  }

  // delete token from db
  const isDeleted = deleteTokenForPhoneNumber(phoneNumber);
  if (!isDeleted) return null;

  try {
    await prisma.user.update({
      where: { id },
      data: {
        phoneVerified: new Date(Date.now()),
        otpByPhone: true,
        otpByPhoneVerified: new Date(Date.now()),
      },
    });
  } catch (e) {
    return { success: false, error: 'Something went wrong!' };
  }
  return { success: true };
}
