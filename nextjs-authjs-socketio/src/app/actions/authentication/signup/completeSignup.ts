'use server';

import { signIn } from '@/app/lib/authentication/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/app/lib/authentication/routes';
import { getUserSignedInfo } from '@/app/lib/data/user';
import prisma from '@/app/lib/prisma';
import {
  TNameSchema,
  TUsernameSchema,
  nameSchema,
  usernameSchema,
} from '@/app/types/account';
import { Prisma } from '@prisma/client';

export default async function CompleteSignup({
  id,
  Name,
  Username,
}: {
  id: string;
  Name: TNameSchema;
  Username: TUsernameSchema;
}) {
  // zod validation
  const nameValidation = nameSchema.safeParse(Name);
  const usernameValidation = usernameSchema.safeParse(Username);
  if (!nameValidation.success) return { error: nameValidation.error.message };
  if (!usernameValidation.success)
    return { error: usernameValidation.error.message };

  const name = Name.name;
  const username = Username.username;

  // Update username and name
  try {
    await prisma.user.update({
      where: { id },
      data: {
        username,
        name,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.log(error);
        return {
          error: `${error?.meta?.target} already exists`,
          target: error?.meta?.target,
        };
      } else {
        console.log("Error: Couldn't create user in db");
        return {
          error: error.message,
        };
      }
    }
    return { error: (error as Error).message };
  }

  const jwt = await getUserSignedInfo(id);
  if (!jwt) return { error: 'No user found' };

  try {
    await signIn('credentials', {
      jwt,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (Error) {
    throw Error;
  }
}
