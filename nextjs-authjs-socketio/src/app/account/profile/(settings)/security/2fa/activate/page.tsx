'use client';
import generate2faSecret from '@/app/actions/authentication/otpauth/authenticator/generate';
import Button from '@/app/components/AtomicUI/Button';
import { useSession } from 'next-auth/react';
import QRCode from 'qrcode';
import { startTransition, useState } from 'react';
import VerifyOTP from './VerifyOtp';

export default function Enable2FA() {
  const [qrcode, setQrcode] = useState<string | undefined>('');
  const [error, setError] = useState<string | undefined>('');
  const { data: session, update } = useSession();
  if (!session) {
    return null;
  }
  const { id } = session?.user;

  function generateOtp() {
    startTransition(() => {
      generate2faSecret(id).then((res) => {
        if (res.success) {
          const otpUrl = res.otpByAuthenticatorUrl;
          if (!otpUrl) {
            setError('Error generating OTP URL');
            return;
          }
          const qr = QRCode.toDataURL(otpUrl).then((qr) => {
            setQrcode(qr);
            update();
          });
        } else {
          setError(res.error);
        }
      });
    });
  }
  return (
    <>
      {!qrcode ? (
        <div className="m-2 mx-auto flex w-1/2 flex-col items-center">
          <h1 className="text center my-10 text-2xl font-semibold">
            Add an extra layer of security to your account.
          </h1>
          <p className="w-full text-justify leading-8">
            follow the step-by-step instructions to enable Two-Factor
            Authentication. You&apos;ll be asked to authenticate your identity
            using a verification code sent to your mobile device or a
            specialized authenticator app.
          </p>

          <p className="my-8 font-semibold">Ready to get started?</p>
          <form action={generateOtp}>
            <Button
              className="rounded-lg bg-gray-600 px-6 py-2 text-white"
              type="submit"
            >
              Enable
            </Button>
          </form>
        </div>
      ) : (
        <VerifyOTP qrcode={qrcode} />
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
    </>
  );
}
