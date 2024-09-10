'use server';
import prisma from '@/app/lib/prisma';
import { signupByEmailSchema, TSignupByEmailSchema } from '@/app/types/account';
import checkEmailIsDisposable from '../disposableEmails/checkEmail';

export default async function CheckEmailValidity(Data: TSignupByEmailSchema) {
  // Validate fields with zod
  const validationFields = signupByEmailSchema.safeParse(Data);
  if (!validationFields.success)
    return { error: 'Invalid Fields!', isValid: false };

  const { email, password } = validationFields.data;

  // Check email address is not disposable
  const isDisposable = await checkEmailIsDisposable({ email });
  if (isDisposable) return { error: isDisposable.message, isValid: false };

  // Check email address is not already taken
  const cleanEmail =
    email.split('@')[0].replace(/\.|\+/g, '') + '@' + email.split('@')[1];

  const existingUser = await prisma.user.findUnique({
    where: { cleanEmail },
  });
  if (existingUser) return { error: 'email already exists', isValid: false };

  return {
    isValid: true,
    error: '',
  };
}
