'use client';
import { useSession } from 'next-auth/react';
import VerificationByOtp from './form-otp';
import VerificationByPassword from './form-password';
import VerificationByPhoneNumber from './form-phone';
import { useVerification } from './verification-contex';

export default function VerificationPage() {
  const { data: session } = useSession();
  const state = useVerification();
  const { showPassword, showPhone, showOtp, dispatch } = state;

  if (!session?.user) {
    return null;
  }
  const { hasPassword } = session.user;

  const {
    otpByPhone,
    otpByPhoneVerified,
    otpByAuthenticator,
    otpByAuthenticatorVerified,
  } = session.user;

  return (
    <div className="mx-auto flex h-full w-2/3 flex-col justify-center">
      <div>
        {showPassword && (
          <>
            <VerificationByPassword />
            <hr className="my-10" />
          </>
        )}
      </div>

      {hasPassword && otpByPhone && otpByPhoneVerified ? (
        <div>
          {showPhone && (
            <>
              <VerificationByPhoneNumber /> <hr className="my-10" />
            </>
          )}
        </div>
      ) : null}

      {otpByAuthenticator && otpByAuthenticatorVerified ? (
        <div>
          {showOtp && (
            <>
              <VerificationByOtp /> <hr className="my-10" />
            </>
          )}
        </div>
      ) : null}

      {/* Menu */}
      <div>
        <div>
          {!showPassword && (
            <button
              onClick={() => {
                dispatch('password');
              }}
            >
              Use password
            </button>
          )}
        </div>
        {hasPassword && otpByPhone && otpByPhoneVerified ? (
          <div>
            {!showPhone && (
              <button
                onClick={() => {
                  dispatch('phone');
                }}
              >
                Use phone number
              </button>
            )}
          </div>
        ) : null}
        {otpByAuthenticator && otpByAuthenticatorVerified ? (
          <div>
            {!showOtp && (
              <button
                onClick={() => {
                  dispatch('otp');
                }}
              >
                Use authenticator app
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
