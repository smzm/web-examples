'use client';
import { sendTokenToPhoneNumber } from '@/app/actions/authentication/login/sendTokenToPhoneNumber';
import { PasswordResetTokenByPhoneNumber } from '@/app/actions/authentication/password/createPasswordResetToken';
import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { TTwoFactorSchema, twoFactorSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function PasswordResetVerificationByPhoneNumber() {
  const [tokenSent, setTokenSent] = useState(false);
  const [tokenError, setTokenError] = useState<any>('');
  const { data: session } = useSession();
  const router = useRouter();

  // RHF + Zod Type
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TTwoFactorSchema>({
    resolver: zodResolver(twoFactorSchema),
  });

  function sendTokenToPhone(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let id;
    const phoneNumber = session?.user?.phoneNumber;
    if (!phoneNumber) {
      return router.push('/account/login');
    }
    sendTokenToPhoneNumber({ byPhoneNumber: { phoneNumber } }).then((res) => {
      if (res.error) {
        return setTokenError({ token: { message: res.error } });
      }
      if (res.success) {
        setTokenSent(true);
      }
    });
  }

  function verifyTokenSentToPhone(Token: TTwoFactorSchema) {
    const phoneNumber = session?.user?.phoneNumber;
    if (!phoneNumber) {
      return null;
    }
    startTransition(() => {
      PasswordResetTokenByPhoneNumber({
        PhoneNumberToken: Token,
        PhoneNumber: { phoneNumber },
      }).then((res) => {
        if (res?.error) {
          return setTokenError({ token: { message: res.error } });
        }
      });
    });
  }

  return (
    <div>
      {!tokenSent ? (
        <div>
          <p className="my-4 font-light text-gray-900">
            We will send you a text message with a verification code.
          </p>
          <form onSubmit={sendTokenToPhone}>
            <Button type="submit" size="lg" variant="default">
              Send Verification code
            </Button>
          </form>
        </div>
      ) : (
        <div>
          <form
            onSubmit={handleSubmit(verifyTokenSentToPhone)}
            className="mt-8"
          >
            <InputField
              label="Verification code"
              name="token"
              register={register}
              errors={errors.token?.message ? errors : tokenError}
              onChangeCallback={() => setTokenError('')}
            />
            <Button type="submit" size="lg" variant="default">
              Verify
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
