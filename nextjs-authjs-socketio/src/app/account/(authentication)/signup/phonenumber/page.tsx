'use client';
import { TPhoneNumberSchema } from '@/app/types/account';
import React, { useState } from 'react';
import SubmitPhoneNumber from './components/submit-phone-number';
import VerifyPhoneNumberForm from './components/verify-phone-number';

type SubmitResult = {
  success: string | undefined;
  error: string | undefined;
};

export default function SignupByPhonenumber() {
  const [phoneNumber, setPhoneNumber] = useState<TPhoneNumberSchema>({
    phoneNumber: '',
  });
  const [submitResult, setSubmitResult] = useState<SubmitResult>({
    success: '',
    error: '',
  });

  return (
    <div>
      <SubmitPhoneNumber
        submitResult={submitResult}
        setSubmitResult={setSubmitResult}
        setPhoneNumber={setPhoneNumber}
      />

      {submitResult.success && (
        <VerifyPhoneNumberForm PhoneNumber={phoneNumber} />
      )}
    </div>
  );
}
