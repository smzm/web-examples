'use server';

import { getEmailVerificationTokenByToken } from '@/app/lib/data/token';
import prisma from '@/app/lib/prisma';
import { rateLimiter } from '@/app/lib/redis/rateLimiter/queries';

export default async function validateEmailVerificationToken(token: string) {
  // rate limit based on ip address
  const rateLimit = await rateLimiter({
    endpoint: 'emailVerification',
    rate_limit: {
      time: 60 * 5, // 5 min
      limit: 20,
    },
  });
  if (!rateLimit.success) return { error: rateLimit.error };

  const existingToken = await getEmailVerificationTokenByToken(token);
  if (!existingToken) return { error: "Token doesn't exist" };

  if (existingToken.User.emailVerified)
    return { error: 'email already verified.' };

  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) return { error: 'Token has expired.' };

  // update user
  await prisma.user.update({
    where: { id: existingToken.userId },
    data: { emailVerified: new Date(), email: existingToken.User.email },
  });

  await prisma.emailVerificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Email verified.' };
}
