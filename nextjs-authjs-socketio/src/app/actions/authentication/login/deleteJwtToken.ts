'use server';
import prisma from '@/app/lib/prisma';
import { cookies } from 'next/headers';

export default async function deleteJwtToken({ id }: { id: string }) {
  try {
    await prisma.jwtToken.delete({
      where: {
        userId: id,
      },
    });

    cookies().delete('st');

    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
}
