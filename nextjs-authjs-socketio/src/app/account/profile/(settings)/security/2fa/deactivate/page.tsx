'use client';
import disable2fa from '@/app/actions/authentication/otpauth/authenticator/disable';
import { useSession } from 'next-auth/react';
import { startTransition, useState } from 'react';

export default function Enable2FA() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [status, setStatus] = useState('');
  const { data: session, update } = useSession();
  if (!session) return null;
  const { id } = session?.user;

  function handleDisable2fa() {
    if (id) {
      // @ts-ignore
      startTransition(async () => {
        const result = await disable2fa(id);
        if (result.error) {
          setStatus(result.error);
          return;
        }
        if (result.success) {
          setStatus('2FA is disabled');
          setIsDisabled(true);
          update();
        }
      });
    }
  }

  if (isDisabled) {
    window.location.replace('/account/profile');
  }
  return (
    <div className="m-2 mx-auto flex w-1/2 flex-col items-center">
      <h1 className="text center my-10 text-2xl font-semibold">
        Disable two factor authentication
      </h1>
      <button
        type="button"
        onClick={handleDisable2fa}
        disabled={Boolean(status)}
        className="rounded-lg bg-gray-600 px-6 py-2 text-white"
      >
        Disable
      </button>
      {status && (
        <div className="m-4 rounded-lg bg-gray-200 px-4 py-2"> {status} </div>
      )}
    </div>
  );
}
