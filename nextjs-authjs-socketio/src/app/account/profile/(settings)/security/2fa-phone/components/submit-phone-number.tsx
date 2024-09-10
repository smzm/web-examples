'use client';
import { generate2faByPhone } from '@/app/actions/authentication/otpauth/phone/generate';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { TPhoneNumberSchema, phoneNumberSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

type phoneNumberError =
  | {
      phoneNumber: { message: string };
    }
  | ''; // because of functionality of input-field if there is no error it should be empty string

export default function SetPhoneNumber({
  id,
  setOtpSent,
  setPhoneNumber,
}: {
  id: string;
  setOtpSent: (otpSent: boolean) => void;
  setPhoneNumber: (phoneNumber: string) => void;
}) {
  const [phoneNumberError, setPhoneNumberError] = useState<phoneNumberError>({
    phoneNumber: { message: '' },
  });

  // Reack Hook Form for phone number input
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<TPhoneNumberSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(phoneNumberSchema),
  });

  // Handle submit for submitting phone number
  function handleSubmitPhoneNumber(PhoneNumber: TPhoneNumberSchema) {
    startTransition(() => {
      generate2faByPhone({ id, PhoneNumber }).then((res) => {
        if (res.error) {
          setPhoneNumberError({ phoneNumber: { message: res.error } });
        }
        if (res.success) {
          setOtpSent(true);
          setPhoneNumber(PhoneNumber.phoneNumber);
          reset();
        }
      });
    });
  }

  return (
    <div className="mx-auto w-1/2">
      <form onSubmit={handleSubmit(handleSubmitPhoneNumber)}>
        <div className="my-8">
          {/* // TODO: Use Custom input field for phone number */}
          <InputField
            label="Phone Number"
            name="phoneNumber"
            register={register}
            errors={errors.phoneNumber?.message ? errors : phoneNumberError}
            onChangeCallback={() => setPhoneNumberError('')}
          />
        </div>
        <Button size="lg" disabled={isSubmitting} variant="default">
          Submit
        </Button>
      </form>
    </div>
  );
}
