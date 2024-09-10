import { getUserByJwtToken } from '@/app/actions/authentication/login/getUsetByJwtToken';
import { redirect } from 'next/navigation';

export default async function ErrorPage({
  searchParams: { error },
}: {
  searchParams: { error: string };
}) {
  let message;
  if (error === 'CallbackRouteError') {
    message = 'Timeout. Please try again.';
  } else if (error === 'AuthorizedCallbackError') {
    const user = await getUserByJwtToken();
    console.log('🟢 redirect from error page');
    if (!user) redirect('/account/login');

    // if user has not username or name redirect to signup completion
    if (!user.username || !user.name) {
      return redirect('/account/signup/completion');
    }

    // if user enabled 2fa redirect to 2fa page
    if (user.otpByAuthenticator || user.otpByPhone) {
      return redirect('/account/login/2fa');
    }
  } else {
    message = 'Something went wrong! Try again!';
  }
  return (
    <div className="m-4 text-center font-medium text-night-200">
      {error && <p className="my-2 text-gray-500">{message}</p>}
    </div>
  );
}
