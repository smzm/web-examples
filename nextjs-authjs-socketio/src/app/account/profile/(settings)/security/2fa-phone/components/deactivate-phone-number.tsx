'use client';
import disable2faByPhone from '@/app/actions/authentication/otpauth/phone/disable';
import Button from '@/app/components/AtomicUI/Button';
import { useSession } from 'next-auth/react';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default function DeactiveOtpByPhoneNumber() {
  const { data: session } = useSession();
  if (!session) redirect('/account/login');
  const { id } = session.user;

  // Deactive Two Factor Authentication by Phone Number
  async function handleDeactive() {
    const deactive = await disable2faByPhone({ id });
    if (deactive) window.location.replace('/account/profile');
  }
  return (
    <div className="mx-auto my-14 w-1/2">
      <h1 className="my-8 text-center text-lg font-semibold">
        Disable Two Factor Authentication by Phone Number
      </h1>
      <p className=" text-center text-gray-500">
        Are you sure you want to deactivate two factor authentication by your
        phone number ?
      </p>
      <form action={handleDeactive}>
        <Button size="lg" variant="default">
          Yes
        </Button>
      </form>
    </div>
  );
}
