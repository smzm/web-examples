import submitPhoneNumber from '@/app/actions/authentication/signup/submitPhoneNumber';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { TPhoneNumberSchema, phoneNumberSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
type PhoneNumberError =
  | {
      // example --> { username : { message: "username already exists" }}
      phoneNumber: { message: string };
    }
  | ''; // because of functionality of input-field if there is no error it should be empty string

export default function SubmitPhoneNumber({
  submitResult,
  setSubmitResult,
  setPhoneNumber,
}: {
  submitResult: any;
  setSubmitResult: any;
  setPhoneNumber: any;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TPhoneNumberSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(phoneNumberSchema),
  });

  const [isWaiting, setIsWaiting] = useState(false);

  function handleSubmitPhoneNumber(PhoneNumber: TPhoneNumberSchema) {
    setSubmitResult({ success: '', error: '' });
    setIsWaiting(true);

    startTransition(() => {
      submitPhoneNumber(PhoneNumber).then((res) => {
        if (res.error) {
          setSubmitResult({
            success: '',
            error: { phoneNumber: { message: res.error } },
          });
        } else if (res.success) {
          setSubmitResult({ success: res.success, error: '' });
          setPhoneNumber(PhoneNumber);
        }
      });
      setIsWaiting(false);
    });
  }
  return (
    <form
      className="flex flex-col"
      onSubmit={handleSubmit(handleSubmitPhoneNumber)}
    >
      <div className="relative mb-4 flex flex-col">
        <InputField
          label="Phone Number"
          name="phoneNumber"
          register={register}
          errors={errors.phoneNumber ? errors : submitResult.error}
          onChangeCallback={() => setSubmitResult({ success: '', error: '' })}
        />
      </div>
      {!submitResult.success && (
        <Button
          size="large"
          color="night"
          variant="primary"
          waiting={isWaiting}
          type="submit"
        >
          Sign up
        </Button>
      )}
    </form>
  );
}
