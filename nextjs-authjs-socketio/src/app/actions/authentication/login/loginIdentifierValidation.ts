'use server';
import {
  getUserByEmail,
  getUserByPhoneNumber,
  getUserByUsername,
} from '@/app/lib/data/user';
import {
  TIdentifierSchema,
  emailSchema,
  phoneNumberSchema,
  usernameSchema,
} from '@/app/types/account';

enum IdentifierTypes {
  Email = 'Email',
  Username = 'Username',
  PhoneNumber = 'Phone Number',
}

export async function loginIdentifierValidation(Identifier: TIdentifierSchema) {
  const { identifier } = Identifier;

  // * Specify identifier is email or username or phone number
  let identifierType: IdentifierTypes;
  if (identifier.includes('@')) {
    identifierType = IdentifierTypes.Email;
  } else if (identifier.match(/^[+]*[0-9]+$/)) {
    identifierType = IdentifierTypes.PhoneNumber;
  } else {
    identifierType = IdentifierTypes.Username;
  }

  // * Validate identifier with zod
  let identifierValidationError: string = '';
  if (identifierType === IdentifierTypes.Email) {
    const emailValidation = emailSchema.safeParse({ email: identifier });
    if (!emailValidation.success) {
      identifierValidationError = emailValidation.error.issues[0].message;
    }
  } else if (identifierType === IdentifierTypes.Username) {
    const usernameValidation = usernameSchema.safeParse({
      username: identifier,
    });
    if (!usernameValidation.success) {
      identifierValidationError = usernameValidation.error.issues[0].message;
    }
  } else if (identifierType === IdentifierTypes.PhoneNumber) {
    const phoneNumberValidation = phoneNumberSchema.safeParse({
      phoneNumber: identifier,
    });
    if (!phoneNumberValidation.success) {
      identifierValidationError = phoneNumberValidation.error.issues[0].message;
    }
  }

  // * Check identifier is exist or not if it's validated successfully
  if (!identifierValidationError) {
    if (identifierType === IdentifierTypes.Email) {
      const user = await getUserByEmail({ email: identifier });
      if (!user) {
        identifierValidationError = "Email doesn't exist";
      }
    } else if (identifierType === IdentifierTypes.Username) {
      const user = await getUserByUsername({ username: identifier });
      if (!user) {
        identifierValidationError = "Username doesn't exist";
      }
    } else if (identifierType === IdentifierTypes.PhoneNumber) {
      const user = await getUserByPhoneNumber({ phoneNumber: identifier });
      if (!user) {
        identifierValidationError = "Phone number doesn't exist";
      }
    }
  }

  // * Return result on success
  return {
    identifierType,
    identifierValidationError,
  };
}
