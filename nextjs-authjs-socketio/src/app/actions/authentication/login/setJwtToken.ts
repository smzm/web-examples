'use server';
import { signJwt } from '@/app/lib/jwt/token';
import prisma from '@/app/lib/prisma';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import { cookies } from 'next/headers';

export default async function setJwtToken({ id }: { id: string }) {
  const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
  const expires = DateTime.now().plus({ hours: 1 }).toJSDate();
  try {
    await prisma.jwtToken.upsert({
      where: { userId: id },
      update: {
        token,
        expires,
      },
      create: {
        userId: id,
        token,
        expires,
      },
    });
    const signedToken = signJwt({ token });
    // Use session storage instead of cookie
    // sessionStorage.setItem('st', signedToken);
    cookies().set('st', signedToken, {
      httpOnly: true,
      // todo : Should uncomment on production state
      // sameSite: 'strict',
      // secure: false,
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}
