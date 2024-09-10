'use server';
// Check email address is not disposable
// parse json file with disposable email addresses
import { emailSchema, TEmailSchema } from '@/app/types/account';

import disposableEmails from './disposable-emails.json';
export default async function checkEmailIsDisposable(Email: TEmailSchema) {
  const validation = emailSchema.safeParse(Email);
  if (!validation.success) {
    return {
      message: validation.error.message,
      code: 400,
    };
  }
  const email = Email.email;
  const isDisposable = disposableEmails.includes(
    email.split('@')[1].toLowerCase(),
  );
  if (isDisposable) {
    return {
      message: 'Enter a valid email address',
    };
  }
}
