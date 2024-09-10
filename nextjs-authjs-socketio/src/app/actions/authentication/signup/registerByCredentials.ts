'use server';
import prisma from '@/app/lib/prisma';
import { TSignupByEmailSchema } from '@/app/types/account';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sendEmailVerificationToken } from '../email/sendEmailVerificationToken';

export default async function registerByCredential(Data: TSignupByEmailSchema) {
  const { email, password } = Data;
  const cleanEmail =
    email.split('@')[0].replace(/\.|\+/g, '') + '@' + email.split('@')[1];
  try {
    const user = await prisma.user.create({
      data: {
        email,
        cleanEmail: cleanEmail,
        password: await bcrypt.hash(password, 12),
      },
    });

    // generate verification token
    if (user.emailVerified) return { error: 'email already verified' };
    // send verification email
    try {
      await sendEmailVerificationToken({
        identifier: email,
        name: '',
        id: user.id,
        type: 'signup',
        redirectPath: '/account/email/verify',
      });
    } catch (err) {
      return { error: (err as Error).message };
    }

    // return created user without password
    if (user) {
      // const { password, ...userWithoutPassword } = user;
      return { success: 'Email sent.' };
    } else {
      return { error: 'Something went wrong!' };
    }
  } catch (error) {
    // Check username or email is not taken before
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          error: `${error?.meta?.target} already exists`,
          target: error?.meta?.target,
        };
      } else {
        console.log("Error: Couldn't create user in db");
        return {
          code: error.code,
          error: error.message,
        };
      }
    }
  }
  throw new Error('Something went wrong!');
}
