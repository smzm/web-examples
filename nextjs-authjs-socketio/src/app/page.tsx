import { auth, signOut } from '@/app/lib/authentication/auth';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import SignOut from './SignOut';

export default async function Home() {
  const session = await auth();

  async function handleSignOut() {
    'use server';
    await signOut();
  }

  const id = session?.user.id;
  if (!id) return <div> not signed in </div>;

  return (
    <div className="flex h-screen flex-col bg-night-925">
      <div className="flex h-screen w-full">
        <Sidebar enabled={'dashboard'} />
        <div className="flex w-full flex-col">
          <Header session={session} />
          <div className="h-full w-full">
            <form action={handleSignOut}>
              <SignOut />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
