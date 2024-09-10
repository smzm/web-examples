'use server';
import { prisma } from '@/app/lib/prisma';
import {
  TEmailSchema,
  TIdentifierSchema,
  TPhoneNumberSchema,
  TUsernameSchema,
  emailSchema,
  identifierSchema,
  phoneNumberSchema,
  usernameSchema,
} from '@/app/types/account';
import { signJwt } from '../jwt/token';

export const getUserByEmail = async ({ email }: TEmailSchema) => {
  const validation = emailSchema.safeParse({ email });
  if (!validation.success) throw new Error('Invalid email');
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        Profile: true,
        Accounts: true,
      },
    });
    return user;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
};

export const getUserByUsername = async ({ username }: TUsernameSchema) => {
  const validation = usernameSchema.safeParse({ username });
  if (!validation.success) throw new Error('Invalid username');

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
      include: {
        Profile: true,
        Accounts: true,
      },
    });
    return user;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
};

export const getUserById = async ({ id }: { id: string }) => {
  // const validation = idSchema.safeParse({ id });
  // if (!validation.success) throw new Error('Invalid id');
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        Profile: true,
        Accounts: true,
      },
    });

    return user;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
};

export const getUserByPhoneNumber = async ({
  phoneNumber,
}: TPhoneNumberSchema) => {
  const validation = phoneNumberSchema.safeParse({ phoneNumber });
  if (!validation.success) throw new Error('Invalid id');

  try {
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
      include: {
        Profile: true,
        Accounts: true,
      },
    });
    return user;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
};

export const getUserByIdentifier = async ({
  identifier,
}: TIdentifierSchema) => {
  const validation = identifierSchema.safeParse({ identifier });
  if (!validation.success) throw new Error('Invalid identifier');

  // check identifier is email or username or phone number
  const isEmail = identifier.includes('@');
  if (isEmail) {
    const validateEmail = emailSchema.safeParse(identifier);
    if (!validateEmail) return null;
  }

  // if identifier is username, validate it
  if (!isEmail) {
    const validateUsername = usernameSchema.safeParse(identifier);
    if (!validateUsername) return null;
  }

  try {
    // lookup the database to find user
    let user;
    if (isEmail) {
      user = await prisma.user.findUnique({
        where: {
          email: identifier,
        },
        include: {
          Profile: true,
          Accounts: true,
        },
      });
      return user;
    } else {
      // find user by it's username inside profile table but query the user table
      user = await prisma.user.findFirst({
        where: {
          username: identifier,
        },
        include: {
          Profile: true,
        },
      });
    }
    return user;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
};

export async function getUserSignedInfo(id: string) {
  const user = await getUserById({ id });
  if (!user) return null;
  const jwt = signJwt(user);
  return jwt;
}
