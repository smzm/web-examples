'use server';
import checkEmailIsDisposable from '@/app/actions/authentication/disposableEmails/checkEmail';
import { sendEmailVerificationToken } from '@/app/actions/authentication/email/sendEmailVerificationToken';
import { auth, signOut } from '@/app/lib/authentication/auth';
import prisma from '@/app/lib/prisma';
import { TEmailSchema, emailSchema } from '@/app/types/account';

export async function submitNewEmail({
  id,
  name,
  Email,
}: {
  id: string;
  name: string;
  Email: TEmailSchema;
}) {
  const session = await auth();
  if (!session) {
    return { error: 'You must be logged in to do this' };
  }
  const oldEmail = session.user.email;
  const { email: newEmail } = Email;
  // zod validation
  const validatedNewEmail = emailSchema.safeParse(Email);
  if (!validatedNewEmail.success) {
    throw new Error(validatedNewEmail.error.message);
  }

  // Check if email is disposable
  const isDisposable = await checkEmailIsDisposable(Email);
  if (isDisposable) {
    return { error: isDisposable?.message };
  }

  // Check email is not already in use
  const cleanEmail =
    newEmail.split('@')[0].replace(/\.|\+/g, '') + '@' + newEmail.split('@')[1];
  const emailInUse = await prisma.user.findUnique({
    where: { cleanEmail },
  });
  if (emailInUse) {
    return { error: 'Email is already in use' };
  }

  try {
    const emailSent = await sendEmailVerificationToken({
      name,
      identifier: newEmail,
      id,
      type: 'changeEmail',
      redirectPath: '/account/security/email/verify',
    });
    if (!emailSent.success) {
      return { error: emailSent.error };
    }
  } catch (err) {
    return { error: 'Something went wrong in sending verification link!' };
  }

  //check email is related to an Oauth account. if so, delete it
  try {
    const oauthAccount = await prisma.account.findFirst({
      where: {
        email: oldEmail,
      },
    });
    if (oauthAccount) {
      await prisma.account.delete({
        where: {
          id: oauthAccount.id,
        },
      });
    }
  } catch (err) {
    return { error: 'Something went wrong in db!' };
  }

  //  update email address
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: newEmail,
        cleanEmail: cleanEmail,
        emailVerified: null,
      },
    });
  } catch (err) {
    return { error: 'Something went wrong in db!' };
  }

  // if Oauth account exist to past email, delete it
  try {
    await prisma.account.deleteMany({
      where: {
        userId: id,
        email: oldEmail,
      },
    });
  } catch (err) {
    console.log('Error:', err);
    return { error: 'Something went wrong in db!' };
  }

  return { success: true, error: null };
}
