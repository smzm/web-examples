'use client';

import { useState } from 'react';
import TFAByAuthenticator from './TFA-otp';
import TFAByPhoneNumber from './TFA-phone-number';

export default function TFAForm({
  otpByAuthenticator,
  otpByPhone,
}: {
  otpByAuthenticator: boolean;
  otpByPhone: boolean;
}) {
  const [showAuthenticator, setShowAuthenticator] = useState(() => {
    if (otpByAuthenticator) {
      return true;
    }
    return false;
  });
  const [showPhoneNumber, setShowPhoneNumber] = useState(() => {
    if (showAuthenticator) {
      return false;
    } else {
      return true;
    }
  });

  return (
    <div>
      {showAuthenticator && otpByAuthenticator ? <TFAByAuthenticator /> : null}
      {showPhoneNumber && otpByPhone ? <TFAByPhoneNumber /> : null}

      {!showAuthenticator && otpByAuthenticator ? (
        <>
          <hr className="my-6" />
          <button
            onClick={() => {
              setShowAuthenticator(true);
              setShowPhoneNumber(false);
            }}
          >
            Authenticator
          </button>
        </>
      ) : null}
      {!showPhoneNumber && otpByPhone ? (
        <>
          <hr className="my-6" />
          <button
            onClick={() => {
              setShowPhoneNumber(true);
              setShowAuthenticator(false);
            }}
          >
            Phone Number
          </button>
        </>
      ) : null}
    </div>
  );
}
