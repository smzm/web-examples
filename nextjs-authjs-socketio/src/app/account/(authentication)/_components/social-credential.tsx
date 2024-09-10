'use client';
import Button from '@/app/components/AtomicUI/Button';
import { DEFAULT_LOGIN_REDIRECT } from '@/app/lib/authentication/routes';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleCredential({ title }: { title: string }) {
  return (
    <Button
      size="large"
      variant="primary"
      color="night"
      onClick={() => signIn('google', { callbackUrl: DEFAULT_LOGIN_REDIRECT })}
      // onClick={() => {
      //   popupCenter('/account/google', 'Sign in with Google');
      // }}
    >
      <FcGoogle className="inline h-5 w-5" />
      <span className="mx-2"> {title} </span>
    </Button>
  );
}

const popupCenter = (url: string, title: string) => {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const width =
    window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

  const height =
    window.innerHeight ??
    document.documentElement.clientHeight ??
    screen.height;

  const systemZoom = width / window.screen.availWidth;

  const left = (width - 500) / 4 / systemZoom + dualScreenLeft;
  const top = (height - 550) / 4 / systemZoom + dualScreenTop;

  // const newWindow = window.open(
  //   url,
  //   title,
  //   `width=${500 / systemZoom},height=${
  //     550 / systemZoom
  //   },top=${top},left=${left}`,
  // );
  const newWindow = window.open(
    url,
    title,
    `width=600,height=750,top=${top},left=${left}`,
  );
  newWindow?.focus();
};
