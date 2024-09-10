'use server';
import {
  deleteTokenForPhoneNumber,
  verifyTokenForPhoneNumber,
} from '@/app/lib/data/token';
import {
  TPhoneNumberSchema,
  TTwoFactorSchema,
  phoneNumberSchema,
  twoFactorSchema,
} from '@/app/types/account';

export default async function verify2faByPhoneNumber({
  PhoneNumber,
  Token,
  deleteToken = true,
}: {
  PhoneNumber: TPhoneNumberSchema;
  Token: TTwoFactorSchema;
  deleteToken?: boolean;
}) {
  // zod validation
  const validPhoneNumber = phoneNumberSchema.safeParse(PhoneNumber);
  const validToken = twoFactorSchema.safeParse(Token);
  if (!validPhoneNumber.success) {
    return {
      error: validPhoneNumber.error.issues[0].message,
      details: 'wrong-phone-number',
    };
  } else if (!validToken.success) {
    return { error: validToken.error.issues[0].message, details: 'wrong-code' };
  }
  const phoneNumber = PhoneNumber.phoneNumber;
  const token = Token.token;

  // verify token
  const verificationResult = await verifyTokenForPhoneNumber(
    token,
    phoneNumber,
  );
  if (!verificationResult) {
    return { error: 'code is wrong', details: 'wrong-code' };
  }

  // delete token from db if needed
  if (deleteToken) {
    const isDeleted = deleteTokenForPhoneNumber(phoneNumber);
    if (!isDeleted)
      return {
        error: 'Something went wrong!',
        details: 'failed-to-delete-token',
      };
  }

  // return success
  return { success: true };
}
