'use server';
import { getUserByIdentifier } from '@/app/lib/data/user';
import { signJwt } from '@/app/lib/jwt/token';
import { sendEmail } from '@/app/lib/nodemailer/sendEmail';
import prisma from '@/app/lib/prisma';
import { rateLimiter } from '@/app/lib/redis/rateLimiter/queries';
import {
  TVerificationTokenSchema,
  verificationTokenSchema,
} from '@/app/types/account';
import { randomUUID } from 'crypto';

export async function sendEmailVerificationToken(
  VerificationToken: TVerificationTokenSchema,
) {
  // ? Add rate limiter which is based on user identifier
  // rate limit based on ip address
  const rateLimit = await rateLimiter({
    endpoint: 'sendEmailVerificationToken',
    rate_limit: {
      time: 60 * 5, // 5 min
      limit: 10,
    },
  });
  if (!rateLimit.success) return { error: rateLimit.error };

  // zod validation
  const validation = verificationTokenSchema.safeParse(VerificationToken);
  if (!validation.success) return { error: 'Invalid fields' };
  const { id, name, identifier, type, redirectPath } = validation.data;

  const isEmail = identifier.includes('@');

  let idFromDB;
  let nameFromDB;
  let emailFromDB;
  if (!id || !name || !isEmail) {
    // if id and firstname are null, lookup user in db
    const user = await getUserByIdentifier({ identifier });
    if (!user) return { error: 'User not found' };
    idFromDB = user.id;
    emailFromDB = user.email;
    nameFromDB = user.name;
  }

  // generate verification token
  const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
  const signedToken = signJwt({ token });

  // upsert token in db
  switch (type) {
    case 'forgetPassword':
      try {
        await prisma.passwordResetToken.upsert({
          where: { userId: id || idFromDB! },
          update: {
            token: token,
            expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours
          },
          create: {
            token: token,
            expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours
            userId: id || idFromDB!,
          },
        });
      } catch (err) {
        throw new Error('Could not create password reset token');
      }
      break;
    case 'changeEmail':
    case 'signup':
      try {
        await prisma.emailVerificationToken.upsert({
          where: { userId: id || idFromDB! },
          update: {
            token: token,
            expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours
          },
          create: {
            token: token,
            expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours
            userId: id || idFromDB!,
          },
        });
        break;
      } catch (err) {
        throw new Error('Could not create email reset token');
      }
  }

  // Get email subject and message based on type
  const { subject, message } = emailMessagebyType(
    type,
    name || nameFromDB!,
    signedToken,
    redirectPath,
  );

  // send verification email
  try {
    await sendEmail({
      to: isEmail ? identifier : emailFromDB!,
      subject,
      message,
    });
  } catch (err) {
    return { error: 'Something went wrong in sending verification link!' };
  }
  return { success: 'Verification email sent.' };
}

const emailMessagebyType = (
  type: 'signup' | 'forgetPassword' | 'changeEmail',
  name: string,
  token: string,
  redirectPath: string,
) => {
  const domain = process.env.APP_DOMAIN;
  switch (type) {
    case 'signup':
      return {
        subject: `🔐 Verify your email`,
        message: `hi, Welcome to ${domain}! Please click the link below to verify your email address. <br><br> <a href="${domain}${redirectPath}?token=${token}">Verify Email</a> <br><br> If you did not create an account, please ignore this email.`,
      };
    case 'forgetPassword':
      return {
        subject: `🔐 Reset your password`,
        message: `hi ${name}, You requested to reset your password. Please click the link below to reset your password. <br><br> <a href="${domain}${redirectPath}?token=${token}">Reset Password</a> <br><br> If you did not request to reset your password, please ignore this email.`,
      };
    case 'changeEmail':
      return {
        subject: `🔐 Verify your new email`,
        message: `hi ${name}, You requested to change your email address. Please click the link below to verify your new email address. <br><br> <a href="${domain}${redirectPath}?token=${token}">Verify Email</a> <br><br> If you did not request to change your email address, please ignore this email.`,
      };
  }
};
