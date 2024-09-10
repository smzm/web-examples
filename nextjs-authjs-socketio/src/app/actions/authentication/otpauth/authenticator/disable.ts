'use server';
import { getUserById } from '@/app/lib/data/user';
import prisma from '@/app/lib/prisma';

export default async function disable2fa(id: string) {
  // lookup the database to find user
  const user = await getUserById({ id });

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (user.otpByAuthenticatorSecret) {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otpByAuthenticator: false,
        otpByAuthenticatorVerified: false,
        otpByAuthenticatorUrl: null,
        otpByAuthenticatorSecret: null,
      },
    });
    return {
      success: true,
    };
  }
  return { error: '2FA is not enabled!' };
}
