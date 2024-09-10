'use client';
import disable2faByPhone from '@/app/actions/authentication/otpauth/phone/disable';
import enable2faByPhone from '@/app/actions/authentication/otpauth/phone/enable';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { TTwoFactorSchema, twoFactorSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

type VerifyError =
  | {
      token: { message: string };
    }
  | ''; // because of functionality of input-field if there is no error it should be empty string

export default function EnablePhoneNumber({
  state,
  id,
  phoneNumber,
}: {
  state: 'enable' | 'disabled';
  id: string;
  phoneNumber: string;
}) {
  const [verifyError, setVerifyError] = useState<VerifyError>('');
  const [success, setSuccess] = useState('');

  // Reack Hook Form for verification
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TTwoFactorSchema>({
    mode: 'onChange',
    resolver: zodResolver(twoFactorSchema),
  });

  // Handle submit for submitting phone number
  function enablePhoneNumber(data: TTwoFactorSchema) {
    startTransition(() => {
      if (state === 'disabled') {
        enable2faByPhone({
          id,
          token: data.token,
          phoneNumber: phoneNumber!,
        }).then((res) => {
          if (res?.error) {
            setVerifyError({ token: { message: res.error } });
          } else if (res?.success) {
            reset();
            setSuccess("You've successfully verified your phone number.");
          }
        });
      } else if (state === 'enable') {
        disable2faByPhone({
          id,
        }).then((res) => {
          if (res.error) {
            setVerifyError({ token: { message: res.error } });
          } else if (res.success) {
            reset();
            setSuccess("You've successfully verified your phone number.");
          }
        });
      }
    });
  }

  return (
    <div className="mx-auto my-8 w-1/2">
      {success ? (
        <div className="mt-4 font-semibold text-green-500">{success}</div>
      ) : (
        <div>
          <h1 className="my-4 text-lg font-semibold">
            Verify your phone number
          </h1>
          <p>
            We have sent you a code to your phone number. Please enter the code
            below.
          </p>
          <form onSubmit={handleSubmit(enablePhoneNumber)}>
            <div className="my-8">
              <InputField
                label="Code"
                name="token"
                register={register}
                errors={errors.token?.message ? errors : verifyError}
                onChangeCallback={() => setVerifyError('')}
              />
            </div>
            <Button size="lg" disabled={isSubmitting} variant="default">
              Submit
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
