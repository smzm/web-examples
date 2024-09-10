import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import {
  HiFingerPrint,
  HiIdentification,
  HiMiniLockClosed,
} from 'react-icons/hi2';
import { MdEmail, MdPhone } from 'react-icons/md';

export default function ProfileMenu() {
  return (
    <div className="m-10">
      <div className="my-4">
        <h2 className="mb-2 mt-4 text-xl font-bold text-night-600">Account</h2>

        <Link
          href="/account/profile/security/email/reset"
          className="group my-1 ml-3 flex w-fit items-center p-1 align-middle"
        >
          <span className="mr-3 text-sm text-night-600 transition group-hover:text-night-100">
            <MdEmail />
          </span>
          <p className="text-base font-medium text-night-300 transition group-hover:text-night-100">
            Email
          </p>
        </Link>

        <Link
          href="/account/profile/username"
          className="group my-1 ml-3 flex w-fit items-center p-1 align-middle"
        >
          <span className="mr-3 text-sm text-night-600 transition group-hover:text-night-100">
            <FaUser />
          </span>
          <p className="text-base font-medium text-night-300 transition group-hover:text-night-100">
            Username
          </p>
        </Link>

        <Link
          href="/account/profile/security/phonenumber"
          className="group my-1 ml-3 flex w-fit items-center p-1 align-middle"
        >
          <span className="mr-3 text-sm text-night-600 transition group-hover:text-night-100">
            <MdPhone />
          </span>
          <p className="text-base font-medium text-night-300 transition group-hover:text-night-100">
            Phone Number
          </p>
        </Link>
      </div>

      <div className="my-4">
        <h2 className="mb-2 mt-4 text-xl font-bold text-night-600">Security</h2>

        <Link
          href="/account/profile/security/password"
          className="group my-1 ml-3 flex w-fit items-center p-1 align-middle"
        >
          <span className="mr-3 text-sm text-night-600 transition group-hover:text-night-100">
            <HiFingerPrint />
          </span>
          <p className="text-base font-medium text-night-300 transition group-hover:text-night-100">
            Password
          </p>
        </Link>

        <Link
          href=""
          className="group my-1 ml-3 flex w-fit items-center p-1 align-middle"
        >
          <span className="mr-3 text-sm text-night-600 transition group-hover:text-night-100">
            <HiMiniLockClosed />
          </span>
          <p className="text-base font-medium text-night-300 transition group-hover:text-night-100">
            Two-factor authentication
          </p>
        </Link>

        <Link
          href=""
          className="group my-1 ml-3 flex w-fit items-center p-1 align-middle"
        >
          <span className="mr-3 text-sm text-night-600 transition group-hover:text-night-100">
            <HiIdentification />
          </span>
          <p className="text-base font-medium text-night-300 transition group-hover:text-night-100">
            Sessions
          </p>
        </Link>
      </div>
    </div>
  );
}
