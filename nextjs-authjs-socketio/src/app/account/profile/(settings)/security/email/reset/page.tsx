'use client';
import { sendEmailVerificationToken } from '@/app/actions/authentication/email/sendEmailVerificationToken';
import { submitNewEmail } from '@/app/actions/authentication/email/submitNewEmail';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { emailSchema, TEmailSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
type EmailError =
  | {
      email: { message: string };
    }
  | ''; // because of functionality of input-field if there is no error it should be empty string

export default function EmailForm() {
  const [registerError, setRegisterError] = useState<EmailError>('');
  const [success, setSuccess] = useState<Boolean>(false);

  // RHF + Zod Type
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TEmailSchema>({
    resolver: zodResolver(emailSchema),
  });

  const { data: session, update } = useSession();
  if (!session) {
    return null;
  }
  const { name, id } = session?.user;

  function handleSignIn(Email: TEmailSchema) {
    setRegisterError('');
    setSuccess(false);
    startTransition(() => {
      // send token to new email address
      if (!name) return;
      submitNewEmail({ id, name, Email }).then(async (res) => {
        if (res?.error) {
          setRegisterError({ email: { message: res.error } });
        }

        if (res?.success) {
          setSuccess(true);
          update();
        }
      });
    });
  }

  return (
    <div className="">
      <h1 className="p-4 text-2xl font-semibold ">Enter a new email address</h1>
      <p className="p-4 text-gray-600">
        Enter new email address and we&apos;ll send you a link to get back into
        your account.{' '}
      </p>
      <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col">
        <div className="relative mb-4 flex flex-col">
          <InputField
            label="Email"
            name="email"
            register={register}
            errors={registerError ? registerError : errors}
          />

          <Button
            size="lg"
            disabled={isSubmitting}
            className="btn-lg bg-gray-900 text-gray-100 hover:bg-gray-800"
          >
            Submit
          </Button>
        </div>
        {success && (
          <div className="rounded-lg bg-green-400 p-2 text-center text-white">
            Your Email Change successfully, please check your email for
            verification
          </div>
        )}
      </form>
    </div>
  );
}
