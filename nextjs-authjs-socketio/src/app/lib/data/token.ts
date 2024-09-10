import { randomBytes } from 'crypto';
import { encode } from 'hi-base32';
import * as OTPAuth from 'otpauth';
import { verifyJwt } from '../jwt/token';
import prisma from '../prisma';

export async function getEmailVerificationTokenByToken(signedToken: string) {
  try {
    const payload = verifyJwt(signedToken);
    const token = payload?.token;
    if (!token) return null;
    // find token in db
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { User: true },
    });
    // Check id in token matches id in db
    return verificationToken;
  } catch {
    return null;
  }
}

export async function getPasswordResetTokenBySignedToken(signedToken: string) {
  try {
    const payload = verifyJwt(signedToken);
    const token = payload?.token;
    if (!token) return null;
    const verificationToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { User: true },
    });

    return verificationToken;
  } catch {
    return null;
  }
}
export function generateTokenForPhoneNumber() {
  const buffer = randomBytes(15);
  const secret = encode(buffer).replace(/=/g, '').substring(0, 24);

  let totp = new OTPAuth.TOTP({
    issuer: process.env.APP_DOMAIN,
    label: process.env.APP_LABEL,
    algorithm: 'SHA1',
    digits: 6,
    period: 60 * 15, // 15 minutes
    secret,
  });
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
  const token = totp.generate();
  return { token, expiresAt };
}

export async function getTokenByPhoneNumber(phoneNumber: string) {
  const tokenInDB = await prisma.phoneNumberToken.findUnique({
    where: { phoneNumber },
  });
  return { token: tokenInDB?.token, expiresAt: tokenInDB?.expiresAt };
}

export async function verifyTokenForPhoneNumber(
  token: string,
  phoneNumber: string,
) {
  // get token from db
  const tokenInDB = await getTokenByPhoneNumber(phoneNumber);
  if (!tokenInDB.token || !tokenInDB.expiresAt) return null;

  // check if token is expired
  if (tokenInDB.expiresAt < new Date(Date.now())) return null;
  // verify token
  const payload = verifyJwt(tokenInDB.token);
  if (!payload) return null;
  if (payload.token !== token) return null;

  return { token };
}

export async function deleteTokenForPhoneNumber(phoneNumber: string) {
  try {
    await prisma.phoneNumberToken.delete({ where: { phoneNumber } });
    return true;
  } catch (error) {
    return false;
  }
}
