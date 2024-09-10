'use client';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import GoogleCredential from '../_components/social-credential';
import { IdentiferForm } from './components/identifier-form';
import PasswordVerificationForm from './components/password-verification-form';
import { PhoneVerificationForm } from './components/phone-verification-form';

export enum IdentifierTypes {
  Email = 'Email',
  Username = 'Username',
  PhoneNumber = 'Phone Number',
}

export default function Login() {
  // * useStates
  const [sentTokenToPhoneNumber, setSentTokenToPhoneNumber] = useState(false);
  const [identifier, setIdentifier] = useState<string>('');
  const [identifierType, setIdentifierType] = useState<IdentifierTypes | null>(
    null,
  );
  const [identifierValidationError, setIdentifierValidationError] =
    useState<any>({});

  // * Session
  const { data: session, status } = useSession();
  // if user is authenticated and has profile redirect to home
  if (session?.user.profile && status === 'authenticated') {
    redirect('/');
  }

  // * JSX
  return (
    <motion.div initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-12 p-2">
        <h2 className='text-night-250" text-[3rem] font-bold tracking-normal'>
          Login
        </h2>
        {/* <p className="text-sm text-night-550">
              Enter your credentials to access your account
            </p> */}
      </div>
      <GoogleCredential title="Sign in with google" />
      <div className="my-6 flex items-center gap-4 text-sm text-night-600 before:h-px before:flex-1 before:bg-night-750  before:content-[''] after:h-px after:flex-1 after:bg-night-750 after:content-['']">
        or
      </div>
      <div className="relative">
        <IdentiferForm
          identifierType={identifierType}
          setIdentifierType={setIdentifierType}
          identifierValidationError={identifierValidationError}
          setIdentifierValidationError={setIdentifierValidationError}
          setIdentifier={setIdentifier}
          setSentTokenToPhoneNumber={setSentTokenToPhoneNumber}
        />

        {identifierType === IdentifierTypes.Email &&
        !identifierValidationError.hasOwnProperty('error') ? (
          <PasswordVerificationForm
            identifier={identifier}
            identifierType={identifierType}
          />
        ) : null}

        {identifierType === IdentifierTypes.Username &&
        !identifierValidationError.hasOwnProperty('error') ? (
          <PasswordVerificationForm
            identifier={identifier}
            identifierType={identifierType}
          />
        ) : null}

        {identifierType === IdentifierTypes.PhoneNumber &&
        !identifierValidationError.hasOwnProperty('error') &&
        sentTokenToPhoneNumber ? (
          <PhoneVerificationForm identifier={identifier} />
        ) : null}
      </div>
    </motion.div>
  );
}
