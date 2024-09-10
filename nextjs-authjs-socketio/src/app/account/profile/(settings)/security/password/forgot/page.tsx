import { auth } from '@/app/lib/authentication/auth';
import { redirect } from 'next/navigation';
import PasswordRestVerificationByEmail from '../components/password-reset-email';
import PasswordResetVerificationByPhoneNumber from '../components/password-reset-phone';

export default async function ForgotPassword() {
  const session = await auth();
  if (!session) redirect('/account/login');
  const { email, phoneNumber } = session?.user;

  return (
    <div className="mx-auto my-10 w-1/2">
      <h1 className="p-4 text-2xl font-semibold">
        Password Reset Verification
      </h1>
      {email && <PasswordRestVerificationByEmail />}
      {phoneNumber && <PasswordResetVerificationByPhoneNumber />}
    </div>
  );
}
