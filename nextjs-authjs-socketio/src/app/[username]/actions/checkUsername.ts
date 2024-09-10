'use server';

import { getUserByUsername } from '@/app/lib/data/user';
import { TUsernameSchema, usernameSchema } from '@/app/types/account';

export default async function checkUsername(Username: TUsernameSchema) {
  // zod validation
  const usernameValidation = usernameSchema.safeParse(Username);
  if (!usernameValidation.success) {
    return {
      success: false,
      error: usernameValidation.error.errors[0].message,
    };
  }

  // database query
  const user = await getUserByUsername(Username);
  if (!user) {
    return {
      success: false,
      error: "Username doesn't exist",
    };
  }

  return { success: true, user: user };
}
