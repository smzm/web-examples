import { getUserByJwtToken } from '@/app/actions/authentication/login/getUsetByJwtToken';
import { redirect } from 'next/navigation';
import SetUsernameForm from './username-form';


export default async function SignUpCompletion() {
  const user = await getUserByJwtToken();
  if (!user) redirect('/account/login');
  const id = user?.id;
  const name = user?.name;
  if (name) {
    return <SetUsernameForm id={id} name={name} />;
  }
  return <SetUsernameForm id={id} />;
}
