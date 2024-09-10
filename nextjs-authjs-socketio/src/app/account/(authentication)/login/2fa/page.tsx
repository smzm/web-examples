import { getUserByJwtToken } from '@/app/actions/authentication/login/getUsetByJwtToken';
import { redirect } from 'next/navigation';
import TFAForm from './TFA-form';

export default async function TFAPage() {
  const user = await getUserByJwtToken();
  if (!user) redirect('/account/login');

  const { otpByAuthenticator, otpByPhone } = user;

  return (
    <TFAForm otpByAuthenticator={otpByAuthenticator} otpByPhone={otpByPhone} />
  );
}
