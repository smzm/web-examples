'use server';
import prisma from '@/app/lib/prisma';
import { TIdSchema, idSchema } from '@/app/types/account';

export default async function disable2faByPhone({ id }: TIdSchema) {
  const validation = idSchema.safeParse({ id });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  await prisma.user.update({
    where: { id },
    data: {
      otpByPhoneVerified: null,
      otpByPhone: false,
    },
  });
  return { success: true };
}
