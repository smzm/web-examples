import { auth } from '@/app/lib/authentication/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AccountSettings() {
  const session = await auth();
  if (!session) return null;
  const {
    email,
    image,
    username,
    name,
    otpByAuthenticator,
    otpByPhone,
    phoneNumber,
  } = session.user;

  if (!username) {
    redirect('/account/profile/username');
  }

  return (
    <div>
      <div>
        <div className="mt-4 text-center">
          <Link
            href="/account/profile/security/email/reset"
            className="cursor-pointer text-base font-medium text-night-300 transition duration-150 hover:text-night-100"
          >
            {email ? 'Change Email address' : 'Add Email address'}
          </Link>
        </div>
        <div className="text-center">
          <Link
            href="/account/profile/username"
            className="cursor-pointer text-base font-medium text-night-300 transition duration-150 hover:text-night-100"
          >
            Change Username
          </Link>
        </div>
        <div className="text-center">
          <Link
            href="/account/profile/security/phonenumber"
            className="cursor-pointer text-base font-medium text-night-300 transition duration-150 hover:text-night-100"
          >
            {phoneNumber ? 'Change phone number' : 'Add phone number'}
          </Link>
        </div>
      </div>
      <div className="mx-auto my-16 cursor-pointer space-y-4 text-center text-gray-600 underline">
        <div>
          {otpByAuthenticator ? (
            <div>
              <Link
                href="/account/profile/security/2fa/deactivate"
                className="cursor-pointer text-base font-medium text-night-300 transition duration-150 hover:text-night-100"
              >
                Disable Two Factor Athorization{' '}
              </Link>
            </div>
          ) : (
            <div>
              <Link
                href="/account/profile/security/2fa/activate"
                className="cursor-pointer text-base font-medium text-night-300 transition duration-150 hover:text-night-100"
              >
                Enable Two Factor Athorization{' '}
              </Link>
            </div>
          )}
        </div>

        <div>
          {otpByPhone ? (
            <Link
              href="/account/profile/security/2fa-phone"
              className="cursor-pointer text-base font-medium text-night-300 transition duration-150 hover:text-night-100"
            >
              Disable Two Factor Athorization By Phone number
            </Link>
          ) : (
            !otpByPhone && (
              <Link
                href="/account/profile/security/2fa-phone"
                className="cursor-pointer text-base font-medium text-night-300 transition duration-150 hover:text-night-100"
              >
                Enable Two Factor Athorization By Phone number
              </Link>
            )
          )}
        </div>
        <div>
          <Link
            href="/account/profile/security/password"
            className="cursor-pointer text-base font-medium text-night-300 transition duration-150 hover:text-night-100"
          >
            Change Password
          </Link>
        </div>

        <div>
          <Link
            href="/"
            className="cursor-pointer text-base font-medium text-night-300 transition duration-150 hover:text-night-100"
          >
            Delete Account (after 24hr)
          </Link>
        </div>
      </div>
    </div>
  );
}
