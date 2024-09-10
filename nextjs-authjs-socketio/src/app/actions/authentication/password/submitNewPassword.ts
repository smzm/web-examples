'use server';

import { getPasswordResetTokenBySignedToken } from '@/app/lib/data/token';
import prisma from '@/app/lib/prisma';
import { rateLimiter } from '@/app/lib/redis/rateLimiter/queries';
import { TPasswordSchema, passwordSchema } from '@/app/types/account';
import { hash } from 'bcryptjs';

export async function submitNewPassword({
  Password,
  id,
}: {
  Password: TPasswordSchema;
  id: string;
}) {
  // rate limit based on ip address
  const rateLimit = await rateLimiter({
    endpoint: 'submitNewPassword',
    rate_limit: {
      time: 60 * 2, // 3 min
      limit: 10,
    },
  });
  if (!rateLimit.success) return { error: rateLimit.error };

  // Zod validation
  const validation = passwordSchema.safeParse(Password);
  if (!validation.success) return { error: 'Password is not valid' };

  const password = validation.data.password;
  // Update password
  const encryptedPassword = await hash(password, 12);
  const updatePassword = await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: encryptedPassword,
    },
  });

  if (!updatePassword) return { error: 'Something went wrong.' };

  return { success: 'Password updated successfully' };
}

export async function submitNewPasswordByToken(
  data: TPasswordSchema,
  token: string,
) {
  // rate limit based on ip address
  const rateLimit = await rateLimiter({
    endpoint: 'submitNewPassword',
    rate_limit: {
      time: 60 * 2, // 3 min
      limit: 10,
    },
  });
  if (!rateLimit.success) return { error: rateLimit.error };

  // Zod validation
  const validation = passwordSchema.safeParse(data);
  if (!validation.success) return { error: 'Password is not valid' };

  // Check if token exists
  const existingToken = await getPasswordResetTokenBySignedToken(token);
  if (!existingToken) return { error: 'You are not verified.' };

  // Check if token has expired
  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) return { error: 'Email verification link, expired.' };

  // Update password
  const encryptedPassword = await hash(data.password, 12);
  const [updatePassword, deleteToken] = await prisma.$transaction([
    // update user password
    prisma.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        password: encryptedPassword,
      },
    }),
    // Delete token
    prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    }),
  ]);

  if (!updatePassword || !deleteToken)
    return { error: 'Something went wrong.' };

  return { success: 'Password updated successfully' };
}
