'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GoogleCredential from '../_components/social-credential';

export default function layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  if (path?.includes('completion')) {
    return <div>{children}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col space-y-4">
        <div className="mb-12 flex items-center align-middle">
          <h2 className='text-night-250" text-[3rem] font-bold tracking-normal'>
            Sign Up
          </h2>
          {/* <p className="text-sm text-night-550">
              Enter your credentials to access your account
            </p> */}
        </div>
        <GoogleCredential title="Sign up with google" />
        <div className="my-6 flex items-center gap-4 text-sm text-night-600 before:h-px before:flex-1 before:bg-night-750  before:content-[''] after:h-px after:flex-1 after:bg-night-750 after:content-['']">
          or
        </div>
        {children}
      </div>
      <p className="mt-4 px-2 text-base font-medium text-night-500">
        Already have an account?{' '}
        <Link
          href="/account/login"
          className="cursor-pointer text-base font-normal text-night-300 underline transition hover:text-night-200"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
