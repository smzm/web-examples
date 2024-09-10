'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import DeactiveOtpByPhoneNumber from './components/deactivate-phone-number';
import EnablePhoneNumber from './components/enable-phone-number';
import SetPhoneNumber from './components/submit-phone-number';

export default function PhoneNumber() {
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const { data: session } = useSession();
  if (!session) redirect('/account/login');
  const { id, otpByPhoneVerified, otpByPhone } = session.user;

  if (otpByPhone) {
    return (
      <>
        <DeactiveOtpByPhoneNumber />;
      </>
    );
  }

  if (otpSent) {
    return (
      <EnablePhoneNumber
        state={otpByPhoneVerified ? 'enable' : 'disabled'}
        id={id}
        phoneNumber={phoneNumber}
      />
    );
  } else if (!otpSent) {
    return (
      <SetPhoneNumber
        id={id}
        setOtpSent={setOtpSent}
        setPhoneNumber={setPhoneNumber}
      />
    );
  }
}
