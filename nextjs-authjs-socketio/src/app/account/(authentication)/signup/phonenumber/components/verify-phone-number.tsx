import registerByPhoneNumber from '@/app/actions/authentication/signup/registerByPhoneNumber';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import {
  TPhoneNumberSchema,
  TTwoFactorSchema,
  twoFactorSchema,
} from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function VerifyPhoneNumberForm({
  PhoneNumber,
}: {
  PhoneNumber: TPhoneNumberSchema;
}) {
  const [result, setResult] = useState<{ success: string; error: any }>({
    success: '',
    error: '',
  });

  const [isWaiting, setIsWaiting] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TTwoFactorSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(twoFactorSchema),
  });

  function handleVerificationToken(Token: TTwoFactorSchema) {
    setIsWaiting(true);
    startTransition(() => {
      registerByPhoneNumber(PhoneNumber, Token).then((res) => {
        if (res?.error) {
          setResult({ success: '', error: { token: { message: res.error } } });
        }
      });
      setIsWaiting(false);
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleVerificationToken)}>
        <InputField
          label="Enter Code Sent to Your Phone"
          name="token"
          errors={errors.token ? errors : result.error}
          register={register}
          onChangeCallback={() => setResult({ success: '', error: '' })}
        />
        <Button
          size="large"
          color="night"
          variant="primary"
          waiting={isWaiting}
          type="submit"
          className="mt-4"
        >
          Sign up
        </Button>
      </form>
      {result.success && (
        <div>
          <p>registered successfully</p>
        </div>
      )}
    </div>
  );
}
