import { verifyJwt } from '@/app/lib/jwt/token';
import prisma from '@/app/lib/prisma';
import { cookies } from 'next/headers';

export async function getUserByJwtToken() {
  const signedToken = cookies().get('st')?.value;
  if (!signedToken) return null;
  const payload = await verifyJwt(signedToken);
  const token = payload?.token;
  if (!token) return null;
  const tokenInDB = await prisma.jwtToken.findUnique({
    where: {
      token,
    },
    include: {
      User: true,
    },
  });
  if (!tokenInDB) return null;
  const user = tokenInDB?.User;

  return user;
}
