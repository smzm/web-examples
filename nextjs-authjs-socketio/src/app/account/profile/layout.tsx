import Avatar from '@/app/components/UI/Avatar';
import { auth } from '@/app/lib/authentication/auth';
import clsx from 'clsx';
import React from 'react';
import Follow from '../../components/UI/Follow';
import ProfileMenu from './components/profileMenu';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const itSelf = session?.user?.id;

  return (
    <div className="h-full w-full bg-night-925">
      <div
        className={clsx(
          'mx-auto bg-night-925 transition-all',
          'h-full w-full',
          // 'lg:w-10/12 xl:w-8/12',
          'grid grid-cols-7',
        )}
      >
        <aside
          className={clsx(
            'flex flex-col px-5 py-20 transition-all',
            // 'min-w-full sm:min-w-min',
            'col-start-1 col-end-8 lg:col-start-1 lg:col-end-4',
          )}
        >
          <ProfileMenu />
        </aside>
        <div
          className={clsx(
            'bg-night-950 p-4',
            'h-full w-full',
            // 'w-full min-w-full sm:min-w-max sm:max-w-2xl',
            'absolute col-start-1 col-end-8 lg:relative lg:col-start-4 lg:col-end-8',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
