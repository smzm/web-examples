'use server';

import { auth } from '@/app/lib/authentication/auth';
import { getUserById } from '@/app/lib/data/user';
import { TPasswordSchema, passwordSchema } from '@/app/types/account';
import { compare } from 'bcryptjs';

export default async function passwordVerification(Password: TPasswordSchema) {
  // Validate fields with zod
  const validation = passwordSchema.safeParse(Password);
  if (!validation.success) return { error: 'Invalid password' };
  const { password } = validation.data;

  // Check if user exist with session
  const session = await auth();
  if (!session) return { error: 'Not authenticated' };
  const id = session?.user?.id;

  // Get user by id
  const user = await getUserById({ id });
  if (!user) return { error: 'User not found, Please sign in again' };
  const { password: passwordInDB } = user;
  if (!passwordInDB) {
    return { error: 'You need to set a password for your account' };
  }

  // if user exist and password exist, compare password
  if (user && (await compare(password, passwordInDB))) {
    return { success: 'Password verified' };
  } else {
    return { error: 'Wrong password' };
  }
}
