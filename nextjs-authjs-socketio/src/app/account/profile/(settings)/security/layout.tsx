'use client';
import { SessionProvider } from '@/app/components/contexts/session';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import VerificationProvider, {
  useVerification,
} from './components/verification/verification-contex';
import VerificationPage from './components/verification/verification-page';

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const accessibleRoute = [
    '/account/security/password',
    '/account/security/password/reset',
    '/account/security/password/set',
    '/account/security/password/forgot',
    '/account/security/email/verify',
  ];
  const allowed = accessibleRoute.includes(pathname);
  const [isVerified, setIsVerified] = useState<Boolean>(false);

  return (
    <SessionProvider>
      {isVerified || allowed ? (
        <> {children}</>
      ) : (
        <VerificationProvider
          isVerified={isVerified}
          setIsVerified={setIsVerified}
          path={pathname}
        >
          <VerificationPage />
        </VerificationProvider>
      )}
    </SessionProvider>
  );
}
