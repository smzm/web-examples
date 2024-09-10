'use server';
import { TIdentifierSchema, identifierSchema } from '../../../types/account';

export default async function isIdentifierBelongtoUser(
  email: string,
  username: string | undefined,
  Identifier: TIdentifierSchema,
) {
  // zod validation for user input field (identifer)
  const validatedIdentifier = identifierSchema.safeParse(Identifier);
  if (!validatedIdentifier.success) {
    return { error: validatedIdentifier.error.message };
  }
  const { identifier: identifierValue } = validatedIdentifier.data;

  // Check username is belong to own user and email is not used by other users
  const isUsername = !identifierValue.includes('@');
  if (isUsername && identifierValue !== username) {
    return { error: 'Username is not related to your account' };
  } else if (!isUsername && identifierValue !== email) {
    return { error: 'Email is not related to your account' };
  }
  return { success: true };
}
