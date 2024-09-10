import { auth } from '@/app/lib/authentication/auth';
import { getUserById } from '@/app/lib/data/user';
import { redirect } from 'next/navigation';
import PasswordResetVerification from './components/password-reset-email';
import SetPassword from './components/set-password';

export default async function PasswordReset() {
  const session = await auth();
  if (!session) return redirect('/account/login');
  const { id } = session.user;
  const user = await getUserById({ id });

  if (user?.password) {
    return <PasswordResetVerification />;
  } else {
    return <SetPassword id={id} />;
  }
}
