'use server';
import { verifyJwt } from '@/app/lib/jwt/token';
import prisma from '@/app/lib/prisma';
import { DateTime } from 'luxon';
import { cookies } from 'next/headers';

export default async function verifyJwtToken({ id }: { id: string }) {
  // token in cookie
  const signedTokenInCookie = cookies().get('st')?.value;
  if (!signedTokenInCookie)
    return { success: false, error: 'Token not found in cookie' };
  const payload = verifyJwt(signedTokenInCookie);
  const tokenInCookie = payload?.token;

  // token in db
  const tokenInDB = await prisma.jwtToken.findUnique({
    where: {
      userId: id,
    },
  });
  if (!tokenInCookie || !tokenInDB)
    return { success: false, error: 'Token not found' };

  // compare token in cookie and token in db
  if (tokenInCookie !== tokenInDB.token) {
    return { success: false, error: 'Wrong token' };
  }

  // check token expiration
  const tokenInDBExpires = tokenInDB.expires;
  const now = DateTime.now().toJSDate();
  if (tokenInDBExpires < now) {
    return { success: false, error: 'Token expired' };
  }

  return { success: true };
}
