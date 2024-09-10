'use client';

import verify2faSecret from '@/app/actions/authentication/otpauth/authenticator/verifiy';
import { TTwoFactorSchema, twoFactorSchema } from '@/app/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { startTransition, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

export default function VerifyOTP({ qrcode }: { qrcode: string }) {
  const [verficationError, setVerificationError] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TTwoFactorSchema>({
    resolver: zodResolver(twoFactorSchema),
  });

  // session
  const { data: session, update } = useSession();
  if (!session) {
    return null;
  }
  const { id } = session?.user;

  // Verification function
  function verify2fa(formData: FieldValues) {
    startTransition(() => {
      verify2faSecret(id, formData.token).then((res) => {
        if (!res.success && res.error) {
          setVerificationError(res.error);
        } else if (res.success && res.otpByAuthenticator) {
          setVerificationResult('2FA enabled successfully');
          setIsEnabled(true);
          update();
        }
      });
    });
  }

  if (isEnabled) {
    window.location.replace('/account/profile');
  }
  return (
    <div className="my-10 flex w-full flex-col items-center justify-center">
      <div>
        <Image
          className="block h-64 w-64 object-contain"
          width={300}
          height={300}
          src={qrcode}
          alt="qrcode of two factor authentication url"
        />
        <div className="my-8 list-decimal space-y-1 text-sm">
          <li>
            Install Google Authenticator (IOS - Android) or Authy (IOS -
            Android).
          </li>
          <li>In the authenticator app, select &quot;+&quot; icon.</li>
          <li>
            Select &quot;Scan a barcode (or QR code)&quot; and use the
            phone&apos;s camera to scan this barcode.
          </li>
        </div>
      </div>

      <form onSubmit={handleSubmit(verify2fa)} className="flex flex-col">
        <input
          className="rounded-lg border-2 border-gray-800 p-2 text-black outline-none "
          type="text"
          {...register('token')}
          onFocus={() => setVerificationError('')}
        />
        <p className="mt-2 text-xs text-red-600">
          {errors.token ? errors.token.message : null}
        </p>
        <button className="my-2 rounded-xl bg-gray-200 p-3">Submit</button>
      </form>
      {verficationError && (
        <div className="mt-2 rounded-lg bg-red-100 px-8 py-2 text-gray-700">
          {verficationError}
        </div>
      )}
      {verificationResult && (
        <div className="mt-2 rounded-lg bg-green-700 px-8 py-2 text-gray-100">
          {verificationResult}
        </div>
      )}
    </div>
  );
}
